import React, { useState, useEffect, useMemo } from 'react';
import { subscribeToRecipes } from '../../services/recipes';
import { RecipeFilter, RecipeFilterCriteria } from '../molecules/RecipeFilter';
import { RecipeList } from './RecipeList';
import type { Recipe, ProteinType } from '../../types/recipe';
import { IconLoader2 } from '@tabler/icons-react';
import { useFavorites } from '../../hooks/useFavorites';

export interface RecipeListContainerProps {
  authorId?: string;
  onRecipeClick?: (recipe: Recipe) => void;
  onEditRecipe?: (recipe: Recipe) => void;
  onDeleteRecipe?: (recipe: Recipe) => void;
  onTogglePublishRecipe?: (recipe: Recipe) => void;
  stickyFilter?: boolean;
  isStickyFilter?: boolean;
  className?: string;
  viewMode?: 'responsive' | 'list' | 'tile' | 'admin';
  filterPosition?: 'top' | 'bottom';
  showFavoritesFilter?: boolean;
}

export const RecipeListContainer: React.FC<RecipeListContainerProps> = ({
  authorId,
  onRecipeClick,
  onEditRecipe,
  onDeleteRecipe,
  onTogglePublishRecipe,
  stickyFilter,
  isStickyFilter,
  className = '',
  viewMode = 'responsive',
  filterPosition = 'bottom',
  showFavoritesFilter,
}) => {
  const { isFavorite } = useFavorites();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<RecipeFilterCriteria>({
    searchText: '',
    maxTimeMinutes: null,
    difficulties: [],
    cuisines: [],
    proteins: [],
    isVeg: false,
    onlyFavorites: false,
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    const queryFilters = {
      ...(authorId ? { authorId } : {}),
      ...(viewMode === 'admin' ? { includeUnpublished: true } : {}),
    };

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
  }, [authorId, viewMode]);

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

  const isStickyActive =
    isStickyFilter !== undefined
      ? isStickyFilter
      : stickyFilter !== undefined
        ? stickyFilter
        : filterPosition === 'bottom';

  const listBottomPadding =
    filterPosition === 'bottom' && isStickyActive ? 'pb-28 sm:pb-32' : 'pb-4';

  const effectiveShowFavorites =
    showFavoritesFilter !== undefined ? showFavoritesFilter : viewMode !== 'admin';

  const filterToolbar =
    isStickyActive && filterPosition === 'bottom' ? (
      <div
        data-recipe-filter-bar="true"
        className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border/40 py-3 shadow-lg"
      >
        <div className="max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 w-full">
          <RecipeFilter
            onFilterChange={setFilters}
            availableCuisines={availableCuisines}
            position="bottom"
            sticky={false}
            showFavoritesFilter={effectiveShowFavorites}
          />
        </div>
      </div>
    ) : (
      <div
        data-recipe-filter-bar="true"
        className={
          filterPosition === 'top'
            ? isStickyActive
              ? 'sticky top-0 z-20 bg-background/95 backdrop-blur-md pb-4 pt-1 border-b border-border/40 mb-4'
              : 'w-full pb-4'
            : 'w-full pt-4 border-t border-border/40'
        }
      >
        <RecipeFilter
          onFilterChange={setFilters}
          availableCuisines={availableCuisines}
          position={filterPosition}
          sticky={false}
          showFavoritesFilter={effectiveShowFavorites}
        />
      </div>
    );

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {filterPosition === 'top' && filterToolbar}

      {/* Recipe List Area with bottom padding to ensure content is not obscured when filter is fixed at bottom */}
      <div className={listBottomPadding}>
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
            onEditRecipe={onEditRecipe}
            onDeleteRecipe={onDeleteRecipe}
            onTogglePublishRecipe={onTogglePublishRecipe}
            viewMode={viewMode}
            emptyMessage={
              filters.onlyFavorites
                ? 'No favorite recipes found matching your filters.'
                : 'No recipes found matching your filters.'
            }
          />
        )}
      </div>

      {filterPosition === 'bottom' && filterToolbar}
    </div>
  );
};

