import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { IconArrowLeft, IconLoader2, IconAlertCircle } from '@tabler/icons-react';
import { getRecipe } from '../services/recipes';
import type { Recipe } from '../types/recipe';

export function RecipeEditor() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const initialRecipe = (location.state as { recipe?: Recipe } | null)?.recipe;
  const [recipe, setRecipe] = useState<Recipe | null>(
    initialRecipe && initialRecipe.id === recipeId ? initialRecipe : null
  );
  const [loading, setLoading] = useState<boolean>(!recipe);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [recipeId, recipe]);

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header with Back Button and Recipe Title */}
      <header className="pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors border border-transparent hover:border-border"
          title="Back to Recipes"
          aria-label="Back to Recipes"
        >
          <IconArrowLeft className="w-5 h-5" stroke={1.5} />
        </button>

        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="h-8 w-48 bg-surface-hover animate-pulse rounded-lg" />
          ) : error ? (
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Recipe Editor
            </h1>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
              {recipe?.title || 'Untitled Recipe'}
            </h1>
          )}
        </div>
      </header>

      {/* Main Content Area: Editor Template UI */}
      <main className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <IconLoader2 className="w-8 h-8 animate-spin text-primary mb-3" stroke={1.5} />
            <p className="text-sm">Loading recipe details...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <IconAlertCircle className="w-6 h-6" stroke={1.5} />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">Unable to load recipe</h2>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              Return to Recipes
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Editor Template
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                Drafting Mode
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Editing <span className="font-semibold text-foreground">{recipe?.title}</span>. Form fields and editor controls will be added here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default RecipeEditor;
