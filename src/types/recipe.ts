import { Timestamp } from 'firebase/firestore';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type ProteinType = 'fish' | 'poultry' | 'red meat' | 'tofu';

export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
    notes?: string;
}

export interface IngredientSection {
    title?: string;
    items: Ingredient[];
}

export interface InstructionStep {
    stepNumber: number;
    instruction: string;
    tip?: string;
}

export interface InstructionSection {
    title?: string;
    steps: InstructionStep[];
}

export interface RecipeUrls {
    label?: string;
    video?: string;
    website?: string;
}

export interface Recipe {
    id: string;
    title: string;
    cuisine: string;
    description: string;
    isVeg: boolean;
    protein?: ProteinType[];
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    equipment: string[];
    urls?: RecipeUrls;
    servings: number;
    difficulty: Difficulty;
    tags: string[];
    ingredients: IngredientSection[];
    instructions: InstructionSection[];
    tips?: string[];
    imageUrl?: string;
    imageStoragePath?: string;
    authorId: string;
    authorName?: string;
    isPublished: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Data needed to create a new recipe.
 * Omits system-managed fields (id, timestamps, image paths).
 */
export interface CreateRecipeInput {
    title: string;
    cuisine: string;
    description: string;
    isVeg: boolean;
    protein?: ProteinType[];
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    equipment?: string[];
    urls?: RecipeUrls;
    servings: number;
    difficulty: Difficulty;
    tags: string[];
    ingredients: IngredientSection[];
    instructions: InstructionSection[];
    tips?: string[];
    authorId: string;
    authorName?: string;
    isPublished?: boolean;
}

/**
 * Data for updating an existing recipe.
 * All fields are optional.
 */
export type UpdateRecipeInput = Partial<Omit<CreateRecipeInput, 'authorId'>>;

/**
 * Filter options for querying recipes.
 */
export interface RecipeFilters {
    authorId?: string;
    cuisine?: string;
    tag?: string;
    difficulty?: Difficulty;
    isVeg?: boolean;
    includeUnpublished?: boolean;
    limitCount?: number;
}

