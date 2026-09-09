import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecipe, createRecipe, updateRecipe } from '../services/recipes';
import type {
  Recipe,
  CreateRecipeInput,
  UpdateRecipeInput,
  IngredientSection,
  InstructionSection
} from '../types/recipe';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './useToast';

const DEFAULT_FORM_DATA: Partial<Recipe> = {
  title: '',
  cuisine: '',
  description: '',
  isVeg: false,
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  servings: 1,
  difficulty: 'medium',
  tags: [],
  equipment: [],
  ingredients: [{ title: '', items: [] }],
  instructions: [{ title: '', steps: [] }],
  isPublished: false,
  protein: [],
};

export function useRecipeForm(recipeId?: string, initialRecipe?: Recipe | null) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const isNew = recipeId === 'new';

  const [recipe, setRecipe] = useState<Recipe | null>(
    initialRecipe && initialRecipe.id === recipeId ? initialRecipe : null
  );
  const [loading, setLoading] = useState<boolean>(!isNew && !recipe);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<Recipe>>(DEFAULT_FORM_DATA);

  // Fetch recipe if editing and not preloaded
  useEffect(() => {
    if (isNew) return;

    if (!recipeId) {
      setError('Recipe ID is required');
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchRecipe() {
      try {
        const fetchedRecipe = await getRecipe(recipeId!);
        if (!isMounted) return;

        if (!fetchedRecipe) {
          setError('Recipe not found.');
        } else {
          setRecipe(fetchedRecipe);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe details.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (!recipe) {
      setLoading(true);
      fetchRecipe();
    }

    return () => {
      isMounted = false;
    };
  }, [recipeId, recipe, isNew]);

  // Sync loaded recipe into form state
  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
    }
  }, [recipe]);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/admin/recipes');
    }
  }, [navigate]);

  const handleCancel = useCallback(() => {
    showToast('Recipe changes canceled', 'info');
    goBack();
  }, [showToast, goBack]);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImageFile(file);
    setRemoveExistingImage(false);
  }, []);

  const handleImageRemove = useCallback(() => {
    setSelectedImageFile(null);
    setRemoveExistingImage(true);
    setFormData((prev) => ({ ...prev, imageUrl: undefined }));
  }, []);

  const handleChange = useCallback(<K extends keyof Recipe>(field: K, value: Recipe[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) {
      showToast('You must be logged in to save recipes.', 'error');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const sanitizedIngredients: IngredientSection[] = (formData.ingredients || [])
        .map((sec) => ({
          ...(sec.title?.trim() ? { title: sec.title.trim() } : {}),
          items: (sec.items || [])
            .filter((ing) => ing.name?.trim() || ing.amount > 0 || ing.unit?.trim())
            .map((ing) => ({
              name: ing.name?.trim() || '',
              amount: ing.amount || 0,
              unit: ing.unit?.trim() || '',
              ...(ing.notes?.trim() ? { notes: ing.notes.trim() } : {})
            }))
        }))
        .filter((sec) => sec.title || sec.items.length > 0);

      const finalIngredients = sanitizedIngredients.length > 0
        ? sanitizedIngredients
        : [{ title: '', items: [] }];

      let stepCounter = 1;
      const sanitizedInstructions: InstructionSection[] = (formData.instructions || [])
        .map((sec) => ({
          ...(sec.title?.trim() ? { title: sec.title.trim() } : {}),
          steps: (sec.steps || [])
            .filter((step) => step.instruction?.trim())
            .map((step) => ({
              stepNumber: stepCounter++,
              instruction: step.instruction?.trim() || '',
              ...(step.tip?.trim() ? { tip: step.tip.trim() } : {})
            }))
        }))
        .filter((sec) => sec.title || sec.steps.length > 0);

      const finalInstructions = sanitizedInstructions.length > 0
        ? sanitizedInstructions
        : [{ title: '', steps: [] }];

      if (isNew) {
        const newRecipeInput: CreateRecipeInput = {
          title: formData.title || 'Untitled Recipe',
          cuisine: formData.cuisine || '',
          description: formData.description || '',
          isVeg: formData.isVeg || false,
          prepTimeMinutes: formData.prepTimeMinutes || 0,
          cookTimeMinutes: formData.cookTimeMinutes || 0,
          servings: formData.servings || 1,
          difficulty: formData.difficulty || 'medium',
          tags: formData.tags || [],
          equipment: formData.equipment || [],
          ingredients: finalIngredients,
          instructions: finalInstructions,
          authorId: user.uid,
          authorName: user.displayName || 'Unknown Author',
          isPublished: formData.isPublished ?? false,
          protein: formData.protein || [],
        };
        await createRecipe(newRecipeInput, selectedImageFile || undefined);
      } else {
        const updateRecipeInput: UpdateRecipeInput = {
          title: formData.title ?? 'Untitled Recipe',
          cuisine: formData.cuisine ?? '',
          description: formData.description ?? '',
          isVeg: formData.isVeg ?? false,
          prepTimeMinutes: formData.prepTimeMinutes ?? 0,
          cookTimeMinutes: formData.cookTimeMinutes ?? 0,
          servings: formData.servings ?? 1,
          difficulty: formData.difficulty ?? 'medium',
          tags: formData.tags ?? [],
          equipment: formData.equipment ?? [],
          ingredients: finalIngredients,
          instructions: finalInstructions,
          isPublished: formData.isPublished ?? false,
          protein: formData.protein || [],
        };
        await updateRecipe(
          recipeId!,
          updateRecipeInput,
          selectedImageFile || undefined,
          removeExistingImage
        );
      }

      showToast('Recipe saved successfully!', 'success');
      goBack();
    } catch (err: unknown) {
      console.error('Error saving recipe:', err);
      const message = err instanceof Error ? err.message : 'Failed to save recipe. Please try again.';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  }, [user, formData, isNew, recipeId, selectedImageFile, removeExistingImage, showToast, goBack]);

  return {
    isNew,
    recipe,
    loading,
    saving,
    error,
    formData,
    selectedImageFile,
    removeExistingImage,
    handleChange,
    handleImageSelect,
    handleImageRemove,
    handleSave,
    handleCancel,
    goBack,
  };
}
