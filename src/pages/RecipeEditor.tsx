import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  IconArrowLeft,
  IconLoader2,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconHexagonLetterE,
  IconHexagonLetterM,
  IconHexagonLetterH,
  IconCarrot,
  IconChevronDown
} from '@tabler/icons-react';
import { getRecipe, createRecipe, updateRecipe } from '../services/recipes';
import type { Recipe, CreateRecipeInput, UpdateRecipeInput, IngredientSection, InstructionSection } from '../types/recipe';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/atoms/Input';
import { Textarea } from '../components/atoms/Textarea';
import { ButtonIcon } from '../components/atoms/ButtonIcon';
import { FormField } from '../components/molecules/FormField';
import { RecipeImageUploader } from '../components/molecules/RecipeImageUploader';
import { IngredientsFormList } from '../components/organisms/IngredientsFormList';
import { InstructionsFormList } from '../components/organisms/InstructionsFormList';
import { useToast } from '../hooks/useToast';

export function RecipeEditor() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { showToast } = useToast();

  const isNew = recipeId === 'new';

  const initialRecipe = (location.state as { recipe?: Recipe } | null)?.recipe;
  const [recipe, setRecipe] = useState<Recipe | null>(
    initialRecipe && initialRecipe.id === recipeId ? initialRecipe : null
  );
  
  // If it's new, we aren't loading an existing recipe.
  const [loading, setLoading] = useState<boolean>(!isNew && !recipe);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState<boolean>(false);
  const [isIngredientsCollapsed, setIsIngredientsCollapsed] = useState<boolean>(false);
  const [isInstructionsCollapsed, setIsInstructionsCollapsed] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<Recipe>>({
    title: '',
    cuisine: '',
    description: '',
    isVeg: false,
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    servings: 1,
    difficulty: 'medium',
    tags: [],
    ingredients: [{ title: '', items: [] }],
    instructions: [{ title: '', steps: [] }],
    isPrivate: false
  });

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

  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
    }
  }, [recipe]);

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/admin/recipes');
    }
  };

  const handleBack = () => {
    goBack();
  };

  const handleCancel = () => {
    showToast('Recipe changes canceled', 'info');
    goBack();
  };

  const handleSave = async () => {
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
          ingredients: finalIngredients,
          instructions: finalInstructions,
          authorId: user.uid,
          authorName: user.displayName || 'Unknown Author',
          isPrivate: formData.isPrivate || false
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
          ingredients: finalIngredients,
          instructions: finalInstructions,
          isPrivate: formData.isPrivate ?? false
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
    } catch (err: any) {
      console.error('Error saving recipe:', err);
      showToast(err.message || 'Failed to save recipe. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImageFile(file);
    setRemoveExistingImage(false);
  };

  const handleImageRemove = () => {
    setSelectedImageFile(null);
    setRemoveExistingImage(true);
    setFormData((prev) => ({ ...prev, imageUrl: undefined }));
  };

  const handleChange = (field: keyof Recipe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (val: string) => {
    const tagsArray = val.split(',').map((t) => t.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  return (
    <div className="space-y-6 w-full pb-20">
      {/* Header with Back Button */}
      <header className="pt-2 flex items-center gap-3">
        <ButtonIcon
          icon={IconArrowLeft}
          onClick={handleBack}
          disabled={saving}
          title="Go back"
          ariaLabel="Go back"
        />
      </header>

      {/* Main Content Area: Editor Template UI */}
      <div className="w-full min-w-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <IconLoader2 className="w-8 h-8 animate-spin text-primary mb-3" stroke={1} />
            <p className="text-sm">Loading recipe details...</p>
          </div>
        ) : !isNew && !recipe ? (
          <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <IconAlertCircle className="w-6 h-6" stroke={1} />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">Recipe Not Found</h2>
              <p className="text-sm text-muted-foreground">{error || "This recipe could not be loaded or doesn't exist."}</p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              Return to Recipes
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Top Section: Left (Image, Title, Description), Right (Metadata Fields) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Image, Title, Description */}
              <div className="md:col-span-5 lg:col-span-5 space-y-4">
                <RecipeImageUploader
                  currentImageUrl={removeExistingImage ? null : formData.imageUrl}
                  selectedFile={selectedImageFile}
                  onSelectImage={handleImageSelect}
                  onRemoveImage={handleImageRemove}
                  disabled={saving}
                />

                <FormField label="Recipe Title">
                  <Input 
                    placeholder="e.g. Grandma's Apple Pie" 
                    value={formData.title || ''} 
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </FormField>

                <FormField label="Description">
                  <Textarea 
                    placeholder="A brief description of this recipe..." 
                    value={formData.description || ''} 
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </FormField>
              </div>

              {/* Right Column: Recipe Metadata Form Fields */}
              <div className="md:col-span-7 lg:col-span-7 space-y-4">
                <FormField label="Cuisine">
                  <Input 
                    placeholder="e.g. Italian, Mexican" 
                    value={formData.cuisine || ''} 
                    onChange={(e) => handleChange('cuisine', e.target.value)}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Prep Time (min)">
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={formData.prepTimeMinutes || ''} 
                      onChange={(e) => handleChange('prepTimeMinutes', parseInt(e.target.value) || 0)}
                    />
                  </FormField>
                  <FormField label="Cook Time (min)">
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={formData.cookTimeMinutes || ''} 
                      onChange={(e) => handleChange('cookTimeMinutes', parseInt(e.target.value) || 0)}
                    />
                  </FormField>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                  <FormField label="Servings" className="w-20 sm:w-24 shrink-0">
                    <Input 
                      type="number" 
                      min={1}
                      placeholder="1" 
                      value={formData.servings || ''} 
                      onChange={(e) => handleChange('servings', parseInt(e.target.value) || 1)}
                    />
                  </FormField>

                  <FormField label="Difficulty" className="shrink-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 h-11" role="radiogroup" aria-label="Difficulty">
                      <ButtonIcon
                        type="button"
                        role="radio"
                        icon={IconHexagonLetterE}
                        active={formData.difficulty === 'easy'}
                        onClick={() => handleChange('difficulty', 'easy')}
                        title="Easy"
                        ariaLabel="Easy difficulty"
                        aria-checked={formData.difficulty === 'easy'}
                        aria-pressed={formData.difficulty === 'easy'}
                        variant="subtle"
                        iconSize={22}
                        iconStroke={1.5}
                      />
                      <ButtonIcon
                        type="button"
                        role="radio"
                        icon={IconHexagonLetterM}
                        active={formData.difficulty === 'medium'}
                        onClick={() => handleChange('difficulty', 'medium')}
                        title="Medium"
                        ariaLabel="Medium difficulty"
                        aria-checked={formData.difficulty === 'medium'}
                        aria-pressed={formData.difficulty === 'medium'}
                        variant="subtle"
                        iconSize={22}
                        iconStroke={1.5}
                      />
                      <ButtonIcon
                        type="button"
                        role="radio"
                        icon={IconHexagonLetterH}
                        active={formData.difficulty === 'hard'}
                        onClick={() => handleChange('difficulty', 'hard')}
                        title="Hard"
                        ariaLabel="Hard difficulty"
                        aria-checked={formData.difficulty === 'hard'}
                        aria-pressed={formData.difficulty === 'hard'}
                        variant="subtle"
                        iconSize={22}
                        iconStroke={1.5}
                      />
                    </div>
                  </FormField>

                  <FormField label="Vegetarian" className="shrink-0">
                    <div className="flex items-center h-11">
                      <ButtonIcon
                        type="button"
                        icon={IconCarrot}
                        isToggle
                        active={formData.isVeg || false}
                        onClick={() => handleChange('isVeg', !formData.isVeg)}
                        title={formData.isVeg ? 'Vegetarian (Active)' : 'Mark as Vegetarian'}
                        ariaLabel="Vegetarian"
                        variant="subtle"
                        iconSize={22}
                        iconStroke={1.5}
                      />
                    </div>
                  </FormField>
                </div>

                <FormField label="Tags" helperText="Comma separated (e.g. healthy, quick, dinner)">
                  <Input 
                    placeholder="healthy, quick" 
                    value={formData.tags?.join(', ') || ''} 
                    onChange={(e) => handleTagsChange(e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            <div className="h-px bg-border my-6" />

            {/* Bottom Section: Ingredients and Instructions 2-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsIngredientsCollapsed(!isIngredientsCollapsed)}
                  className="flex items-center gap-2 text-left group select-none focus:outline-none w-fit rounded-lg py-1 px-1 -ml-1 hover:bg-surface-hover/80 transition-colors"
                  aria-expanded={!isIngredientsCollapsed}
                  title={isIngredientsCollapsed ? 'Expand Ingredients' : 'Collapse Ingredients'}
                >
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Ingredients
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted-foreground font-medium">
                    {(formData.ingredients || []).reduce((acc, s) => acc + (s.items?.length || 0), 0)}
                  </span>
                  <IconChevronDown
                    className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                      isIngredientsCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                    stroke={2}
                  />
                </button>

                {!isIngredientsCollapsed && (
                  <IngredientsFormList 
                    ingredients={formData.ingredients || []}
                    onChange={(ingredients) => handleChange('ingredients', ingredients)}
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsInstructionsCollapsed(!isInstructionsCollapsed)}
                  className="flex items-center gap-2 text-left group select-none focus:outline-none w-fit rounded-lg py-1 px-1 -ml-1 hover:bg-surface-hover/80 transition-colors"
                  aria-expanded={!isInstructionsCollapsed}
                  title={isInstructionsCollapsed ? 'Expand Instructions' : 'Collapse Instructions'}
                >
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Instructions
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted-foreground font-medium">
                    {(formData.instructions || []).reduce((acc, s) => acc + (s.steps?.length || 0), 0)}
                  </span>
                  <IconChevronDown
                    className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                      isInstructionsCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                    stroke={2}
                  />
                </button>

                {!isInstructionsCollapsed && (
                  <InstructionsFormList 
                    instructions={formData.instructions || []}
                    onChange={(instructions) => handleChange('instructions', instructions)}
                  />
                )}
              </div>
            </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 pb-2 border-t border-border">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface hover:bg-surface-hover border border-border text-foreground text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <IconX className="w-5 h-5" stroke={1} />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <IconLoader2 className="w-5 h-5 animate-spin" stroke={1} />
                  ) : (
                    <IconCheck className="w-5 h-5" stroke={1} />
                  )}
                  Save Recipe
                </button>
              </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default RecipeEditor;
