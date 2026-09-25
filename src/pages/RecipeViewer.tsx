import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { IconLoader2, IconAlertCircle } from '@tabler/icons-react';
import { getRecipe } from '../services/recipes';
import type { Recipe } from '../types/recipe';
import { useAuth } from '../contexts/AuthContext';
import { RecipeViewerHero } from '../components/organisms/RecipeViewerHero';
import { RecipeViewerIngredients, type RecipeViewerIngredientsHandle } from '../components/organisms/RecipeViewerIngredients';
import { RecipeViewerInstructions, type RecipeViewerInstructionsHandle } from '../components/organisms/RecipeViewerInstructions';
import { RecipeViewerTips, type RecipeViewerTipsHandle } from '../components/organisms/RecipeViewerTips';
import { RecipeScrollController } from '../components/molecules/RecipeScrollController';

export function RecipeViewer() {
    const { recipeId } = useParams<{ recipeId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdmin } = useAuth();

    const initialRecipe = (location.state as { recipe?: Recipe } | null)?.recipe;
    const [recipe, setRecipe] = useState<Recipe | null>(
        initialRecipe && initialRecipe.id === recipeId ? initialRecipe : null
    );
    const [servings, setServings] = useState<number>(
        (initialRecipe && initialRecipe.id === recipeId && initialRecipe.servings) ? initialRecipe.servings : 1
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

        async function fetchRecipeDetails() {
            try {
                const fetchedRecipe = await getRecipe(recipeId!);
                if (!isMounted) return;

                if (!fetchedRecipe) {
                    setError('Recipe not found.');
                } else {
                    setRecipe(fetchedRecipe);
                    if (fetchedRecipe.servings) {
                        setServings(fetchedRecipe.servings);
                    }
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

        fetchRecipeDetails();

        return () => {
            isMounted = false;
        };
    }, [recipeId]);

    const ingredientsRef = useRef<RecipeViewerIngredientsHandle>(null);
    const instructionsRef = useRef<RecipeViewerInstructionsHandle>(null);
    const tipsRef = useRef<RecipeViewerTipsHandle>(null);

    const baseServings = recipe?.servings && recipe.servings > 0 ? recipe.servings : 1;
    const currentServings = servings > 0 ? servings : baseServings;
    const scaleRatio = baseServings > 0 ? currentServings / baseServings : 1;

    const scaledIngredients = useMemo(() => {
        if (!recipe?.ingredients) return [];
        return recipe.ingredients.map((sec) => ({
            ...sec,
            items: (sec.items || []).map((item) => ({
                ...item,
                amount: item.amount > 0 ? Math.round(item.amount * scaleRatio * 1000) / 1000 : item.amount,
            })),
        }));
    }, [recipe?.ingredients, scaleRatio]);


    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleScrollToIngredients = () => {
        if (ingredientsRef.current) {
            ingredientsRef.current.scrollToIngredients();
        } else {
            const el = document.getElementById('recipe-ingredients');
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 20;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    const handleScrollToInstructions = () => {
        if (instructionsRef.current) {
            instructionsRef.current.scrollToFirstUncheckedStep();
        } else {
            const el = document.getElementById('recipe-instructions');
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 20;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    const handleScrollToTips = () => {
        if (tipsRef.current) {
            tipsRef.current.scrollToTips();
        } else {
            const el = document.getElementById('recipe-tips');
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 20;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    const handleEdit = () => {
        if (recipe) {
            navigate(`/admin/recipes/${recipe.id}`, { state: { recipe } });
        }
    };

    return (
        <div className="space-y-6 w-full pb-16">

            {/* Content Area */}
            <main className="w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <IconLoader2 className="w-8 h-8 animate-spin text-primary mb-3" stroke={1.5} />
                        <p className="text-sm">Loading recipe details...</p>
                    </div>
                ) : error || !recipe ? (
                    <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-4 max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                            <IconAlertCircle className="w-6 h-6" stroke={1.5} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold text-foreground">Recipe Not Found</h2>
                            <p className="text-sm text-muted-foreground">{error || "This recipe doesn't exist or has been removed."}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/recipes')}
                            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium shadow-sm transition-colors"
                        >
                            Return to Recipes
                        </button>
                    </div>
                ) : (
                    /* Responsive Layout: Stacked on mobile, 2-column on large screens */
                    <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                        {/* Left Column: Hero & Ingredients (with mobile Tips above ingredients) */}
                        <div className="space-y-6 lg:col-span-5">
                            <RecipeViewerHero
                                recipe={recipe}
                                servings={currentServings}
                                onServingsChange={setServings}
                                onEdit={isAdmin ? handleEdit : undefined}
                            />
                            {recipe.tips && recipe.tips.length > 0 && (
                                <RecipeViewerTips
                                    ref={tipsRef}
                                    tips={recipe.tips}
                                    className="lg:hidden"
                                />
                            )}
                            <RecipeViewerIngredients
                                ref={ingredientsRef}
                                ingredients={scaledIngredients}
                            />
                        </div>

                        {/* Right Column: Tips (desktop) & Instructions */}
                        <div className="space-y-6 lg:col-span-7">
                            {recipe.tips && recipe.tips.length > 0 && (
                                <RecipeViewerTips
                                    tips={recipe.tips}
                                    className="hidden lg:block"
                                />
                            )}
                            <RecipeViewerInstructions
                                ref={instructionsRef}
                                instructions={recipe.instructions || []}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* Floating Mobile Scroll Controller */}
            {recipe && !loading && !error && (
                <RecipeScrollController
                    onScrollToTop={handleScrollToTop}
                    onScrollToIngredients={handleScrollToIngredients}
                    onScrollToInstructions={handleScrollToInstructions}
                    onScrollToTips={recipe.tips && recipe.tips.length > 0 ? handleScrollToTips : undefined}
                />
            )}
        </div>
    );
}
