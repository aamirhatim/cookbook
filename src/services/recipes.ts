import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    onSnapshot,
    QueryConstraint,
    Unsubscribe,
    Timestamp,
    UpdateData,
    DocumentData
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type {
    Recipe,
    IngredientSection,
    InstructionSection,
    CreateRecipeInput,
    UpdateRecipeInput,
    RecipeFilters
} from '../types/recipe';

const RECIPES_COLLECTION = 'recipes';

/**
 * Uploads a recipe cover photo to Firebase Cloud Storage.
 * Saves to path: recipes/{recipeId}/{timestamp}_{filename}
 */
export async function uploadRecipeImage(
    recipeId: string,
    file: File
): Promise<{ imageUrl: string; storagePath: string }> {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `recipes/${recipeId}/${Date.now()}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, file, {
        contentType: file.type
    });
    const imageUrl = await getDownloadURL(snapshot.ref);

    return { imageUrl, storagePath };
}

/**
 * Deletes a file from Firebase Cloud Storage by its storage path.
 */
export async function deleteRecipeImage(storagePath: string): Promise<void> {
    try {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
    } catch (error) {
        // If the file was already deleted or doesn't exist, log and proceed gracefully
        console.warn(`Could not delete storage object at ${storagePath}:`, error);
    }
}

/**
 * Recursively removes all keys with `undefined` values from an object or array.
 * Firestore rejects payloads containing `undefined` field values.
 */
function stripUndefined<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => stripUndefined(item)) as unknown as T;
    }
    if (obj.constructor && obj.constructor.name !== 'Object') {
        return obj;
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            result[key] = stripUndefined(value);
        }
    }
    return result as T;
}

/**
 * Normalizes Firestore document data into a typed Recipe object.
 * Seamlessly adapts legacy flat ingredient/instruction arrays into section structures.
 */
export function normalizeRecipe(id: string, data: DocumentData): Recipe {
    const rawIngredients = data.ingredients;
    let ingredients: IngredientSection[] = [];

    if (Array.isArray(rawIngredients)) {
        if (rawIngredients.length > 0 && ('name' in rawIngredients[0] || !('items' in rawIngredients[0]))) {
            // Legacy flat Ingredient[]
            ingredients = [{
                title: '',
                items: rawIngredients.map((item: any) => ({
                    name: item.name || '',
                    amount: item.amount || 0,
                    unit: item.unit || '',
                    ...(item.notes ? { notes: item.notes } : {})
                }))
            }];
        } else {
            ingredients = rawIngredients.map((sec: any) => ({
                ...(sec.title ? { title: sec.title } : {}),
                items: Array.isArray(sec.items)
                    ? sec.items.map((item: any) => ({
                          name: item.name || '',
                          amount: item.amount || 0,
                          unit: item.unit || '',
                          ...(item.notes ? { notes: item.notes } : {})
                      }))
                    : []
            }));
        }
    }

    const rawInstructions = data.instructions;
    let instructions: InstructionSection[] = [];

    if (Array.isArray(rawInstructions)) {
        if (rawInstructions.length > 0 && ('instruction' in rawInstructions[0] || !('steps' in rawInstructions[0]))) {
            // Legacy flat InstructionStep[]
            instructions = [{
                title: '',
                steps: rawInstructions.map((step: any, idx: number) => ({
                    stepNumber: step.stepNumber || idx + 1,
                    instruction: step.instruction || '',
                    ...(step.tip ? { tip: step.tip } : {})
                }))
            }];
        } else {
            instructions = rawInstructions.map((sec: any) => ({
                ...(sec.title ? { title: sec.title } : {}),
                steps: Array.isArray(sec.steps)
                    ? sec.steps.map((step: any, idx: number) => ({
                          stepNumber: step.stepNumber || idx + 1,
                          instruction: step.instruction || '',
                          ...(step.tip ? { tip: step.tip } : {})
                      }))
                    : []
            }));
        }
    }

    return {
        ...data,
        id,
        ingredients,
        instructions
    } as Recipe;
}

/**
 * Creates a new recipe in Firestore, optionally uploading a cover photo to Storage.
 */
export async function createRecipe(
    input: CreateRecipeInput,
    imageFile?: File
): Promise<Recipe> {
    const recipeRef = doc(collection(db, RECIPES_COLLECTION));
    const recipeId = recipeRef.id;

    let imageUrl: string | undefined;
    let imageStoragePath: string | undefined;

    if (imageFile) {
        const uploadResult = await uploadRecipeImage(recipeId, imageFile);
        imageUrl = uploadResult.imageUrl;
        imageStoragePath = uploadResult.storagePath;
    }

    const recipeData = stripUndefined({
        ...input,
        id: recipeId,
        isPrivate: input.isPrivate ?? false,
        imageUrl: imageUrl ?? null,
        imageStoragePath: imageStoragePath ?? null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    await setDoc(recipeRef, recipeData);

    return normalizeRecipe(recipeId, {
        ...recipeData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        imageUrl,
        imageStoragePath
    });
}

/**
 * Fetches a single recipe by its document ID.
 */
export async function getRecipe(recipeId: string): Promise<Recipe | null> {
    const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);
    const snapshot = await getDoc(recipeRef);

    if (!snapshot.exists()) {
        return null;
    }

    return normalizeRecipe(snapshot.id, snapshot.data());
}

/**
 * Helper to construct query constraints based on filters.
 */
function buildRecipeQueryConstraints(filters: RecipeFilters = {}): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];

    if (filters.authorId) {
        constraints.push(where('authorId', '==', filters.authorId));
    } else if (!filters.includePrivate) {
        // If querying globally without authorId, default to public recipes only
        constraints.push(where('isPrivate', '==', false));
    }

    if (filters.cuisine) {
        constraints.push(where('cuisine', '==', filters.cuisine));
    }

    if (filters.tag) {
        constraints.push(where('tags', 'array-contains', filters.tag));
    }

    if (filters.difficulty) {
        constraints.push(where('difficulty', '==', filters.difficulty));
    }

    if (filters.isVeg !== undefined) {
        constraints.push(where('isVeg', '==', filters.isVeg));
    }

    // Order by most recently created
    constraints.push(orderBy('createdAt', 'desc'));

    if (filters.limitCount && filters.limitCount > 0) {
        constraints.push(limit(filters.limitCount));
    }

    return constraints;
}

/**
 * One-time fetch of multiple recipes matching the given filters.
 */
export async function getRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
    const constraints = buildRecipeQueryConstraints(filters);
    const q = query(collection(db, RECIPES_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
        (docSnap) => normalizeRecipe(docSnap.id, docSnap.data())
    );
}

/**
 * Real-time listener for recipes matching the given filters.
 * Returns an unsubscribe function to be called when unmounting components.
 */
export function subscribeToRecipes(
    filters: RecipeFilters = {},
    onUpdate: (recipes: Recipe[]) => void,
    onError?: (error: Error) => void
): Unsubscribe {
    const constraints = buildRecipeQueryConstraints(filters);
    const q = query(collection(db, RECIPES_COLLECTION), ...constraints);

    return onSnapshot(
        q,
        (snapshot) => {
            const recipes = snapshot.docs.map(
                (docSnap) => normalizeRecipe(docSnap.id, docSnap.data())
            );
            onUpdate(recipes);
        },
        (error) => {
            console.error('Error listening to recipe changes:', error);
            if (onError) onError(error);
        }
    );
}

/**
 * Updates an existing recipe in Firestore.
 * If a new image file is provided, replaces the old image in Storage.
 * If removeImage is true and no new image is provided, deletes the existing image from Storage and clears image fields.
 */
export async function updateRecipe(
    recipeId: string,
    input: UpdateRecipeInput,
    newImageFile?: File,
    removeImage?: boolean
): Promise<void> {
    const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);

    const updates = stripUndefined<UpdateData<DocumentData>>({
        ...input,
        updatedAt: serverTimestamp()
    });

    if (newImageFile) {
        // Fetch existing doc to check for an old image to remove
        const existing = await getRecipe(recipeId);
        const uploadResult = await uploadRecipeImage(recipeId, newImageFile);

        updates.imageUrl = uploadResult.imageUrl;
        updates.imageStoragePath = uploadResult.storagePath;

        if (existing?.imageStoragePath) {
            await deleteRecipeImage(existing.imageStoragePath);
        }
    } else if (removeImage) {
        const existing = await getRecipe(recipeId);
        if (existing?.imageStoragePath) {
            await deleteRecipeImage(existing.imageStoragePath);
        }
        updates.imageUrl = null;
        updates.imageStoragePath = null;
    }

    await updateDoc(recipeRef, updates);
}

/**
 * Deletes a recipe document from Firestore and its associated cover photo from Storage.
 */
export async function deleteRecipe(recipeId: string): Promise<void> {
    // First, check if the recipe has an image in Cloud Storage
    const existing = await getRecipe(recipeId);
    if (existing?.imageStoragePath) {
        await deleteRecipeImage(existing.imageStoragePath);
    }

    // Delete the Firestore document
    const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);
    await deleteDoc(recipeRef);
}
