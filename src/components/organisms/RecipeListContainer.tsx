import React, { useState, useEffect, useMemo } from 'react';
import { subscribeToRecipes } from '../../services/recipes';
import { RecipeFilter, RecipeFilterCriteria } from '../molecules/RecipeFilter';
import { RecipeList } from '../molecules/RecipeList';
import type { Recipe } from '../../types/recipe';
import { IconLoader2 } from '@tabler/icons-react';

export interface RecipeListContainerProps {
  authorId?: string;
  onRecipeClick?: (recipe: Recipe) => void;
  className?: string;
}

export const RecipeListContainer: React.FC<RecipeListContainerProps> = ({
  authorId,
  onRecipeClick,
  className = '',
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<RecipeFilterCriteria>({
    searchText: '',
    maxTimeMinutes: null,
    difficulties: [],
    cuisines: [],
    isVeg: false,
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    const queryFilters = authorId ? { authorId } : {};

    const unsubscribe = subscribeToRecipes(
      queryFilters,
      (fetchedRecipes) => {
        setRecipes(fetchedRecipes);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again.');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authorId]);

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
        const matchesIngredient = recipe.ingredients?.some((ing) =>
          ing.name.toLowerCase().includes(query)
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

      // 5. Vegetarian filter
      if (filters.isVeg && !recipe.isVeg) {
        return false;
      }

      return true;
    });
  }, [recipes, filters]);

  return (
    <div className={`flex flex-col gap-5 w-full ${className}`}>
      <RecipeFilter
        onFilterChange={setFilters}
        availableCuisines={availableCuisines}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <IconLoader2 className="w-8 h-8 animate-spin text-primary mb-2" stroke={1} />
          <p className="text-sm">Loading recipes...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
          {error}
        </div>
      ) : (
        <RecipeList
          recipes={filteredRecipes}
          onRecipeClick={onRecipeClick}
        />
      )}
    </div>
  );
};

