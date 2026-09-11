import { useMemo } from 'react';
import type { Recipe, ProteinType } from '../types/recipe';
import type { RecipeFilterCriteria } from '../components/molecules/RecipeFilter';

export interface UseFilteredRecipesResult {
    filteredRecipes: Recipe[];
    availableCuisines: string[];
}

export function useFilteredRecipes(
    recipes: Recipe[],
    filters: RecipeFilterCriteria,
    isFavorite: (recipeId: string) => boolean
): UseFilteredRecipesResult {
    // Extract unique available cuisines from loaded recipes
    const availableCuisines = useMemo(() => {
        const cuisineSet = new Set<string>();
        recipes.forEach((r) => {
            if (r.cuisine && r.cuisine.trim()) {
                cuisineSet.add(r.cuisine.trim().toLowerCase());
            }
        });
        return Array.from(cuisineSet);
    }, [recipes]);

    // Client-side filtering
    const filteredRecipes = useMemo(() => {
        return recipes.filter((recipe) => {
            // 1. Text search against title, ingredients, equipment, tags
            if (filters.searchText) {
                const query = filters.searchText.toLowerCase();
                const matchesTitle = recipe.title.toLowerCase().includes(query);
                const matchesIngredient = recipe.ingredients?.some((section) =>
                    (section.title && section.title.toLowerCase().includes(query)) ||
                    section.items?.some((ing) => ing.name.toLowerCase().includes(query))
                );
                const matchesEquipment = recipe.equipment?.some((eq) =>
                    eq.toLowerCase().includes(query)
                );
                const matchesTag = recipe.tags?.some((t) =>
                    t.toLowerCase().includes(query)
                );

                if (!matchesTitle && !matchesIngredient && !matchesEquipment && !matchesTag) {
                    return false;
                }
            }

            // 2. Total time filter (prepTime + cookTime)
            if (filters.maxTimeMinutes !== null) {
                const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
                if (totalTime > filters.maxTimeMinutes) {
                    return false;
                }
            }

            // 3. Difficulty filter
            if (filters.difficulties.length > 0) {
                if (!filters.difficulties.includes(recipe.difficulty)) {
                    return false;
                }
            }

            // 4. Cuisine filter
            if (filters.cuisines.length > 0) {
                const recipeCuisine = (recipe.cuisine || '').toLowerCase();
                if (!filters.cuisines.includes(recipeCuisine)) {
                    return false;
                }
            }

            // 5. Protein & Vegetarian filter
            if (filters.proteins && filters.proteins.length > 0) {
                const matches = filters.proteins.some((p) => {
                    if (p === 'veg') {
                        return Boolean(recipe.isVeg);
                    }
                    return recipe.protein?.includes(p as ProteinType);
                });
                if (!matches) {
                    return false;
                }
            } else if (filters.isVeg && !recipe.isVeg) {
                return false;
            }

            // 6. Favorites filter
            if (filters.onlyFavorites && !isFavorite(recipe.id)) {
                return false;
            }

            return true;
        });
    }, [recipes, filters, isFavorite]);

    return { filteredRecipes, availableCuisines };
}
