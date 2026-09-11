import React, { useState } from 'react';
import { RecipeFilter, RecipeFilterCriteria } from '../molecules/RecipeFilter';
import { RecipeList } from './RecipeList';
import type { Recipe } from '../../types/recipe';
import { IconLoader2 } from '@tabler/icons-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useRecipes } from '../../hooks/useRecipes';
import { useFilteredRecipes } from '../../hooks/useFilteredRecipes';

export interface RecipeListContainerProps {
    recipes?: Recipe[];
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
    leftAction?: React.ReactNode;
}

export const RecipeListContainer: React.FC<RecipeListContainerProps> = ({
    recipes: propRecipes,
    authorId,
    onRecipeClick,
    onEditRecipe,
    onDeleteRecipe,
    onTogglePublishRecipe,
    stickyFilter,
    isStickyFilter,
    className = '',
    viewMode = 'responsive',
    filterPosition,
    showFavoritesFilter,
    leftAction,
}) => {
    const { isFavorite } = useFavorites();

    const hookResult = useRecipes(
        propRecipes ? undefined : { authorId, includeUnpublished: viewMode === 'admin' }
    );
    const recipes = propRecipes ?? hookResult.recipes;
    const loading = propRecipes ? false : hookResult.loading;
    const error = propRecipes ? null : hookResult.error;

    const [filters, setFilters] = useState<RecipeFilterCriteria>({
        searchText: '',
        maxTimeMinutes: null,
        difficulties: [],
        cuisines: [],
        proteins: [],
        isVeg: false,
        onlyFavorites: false,
    });

    const { filteredRecipes, availableCuisines } = useFilteredRecipes(
        recipes,
        filters,
        isFavorite
    );

    const effectiveFilterPosition =
        filterPosition !== undefined
            ? filterPosition
            : viewMode === 'admin'
                ? 'top'
                : 'bottom';

    const isStickyActive =
        isStickyFilter !== undefined
            ? isStickyFilter
            : stickyFilter !== undefined
                ? stickyFilter
                : effectiveFilterPosition === 'bottom';

    const listBottomPadding =
        effectiveFilterPosition === 'bottom' && isStickyActive ? 'pb-28 sm:pb-32' : 'pb-4';

    const effectiveShowFavorites =
        showFavoritesFilter !== undefined ? showFavoritesFilter : viewMode !== 'admin';

    const filterToolbar =
        isStickyActive && effectiveFilterPosition === 'bottom' ? (
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
                        leftAction={leftAction}
                    />
                </div>
            </div>
        ) : (
            <div
                data-recipe-filter-bar="true"
                className={
                    effectiveFilterPosition === 'top'
                        ? isStickyActive
                            ? 'sticky top-0 z-20 bg-background/95 backdrop-blur-md pb-4 pt-1 border-b border-border/40 mb-4'
                            : 'w-full pb-4'
                        : 'w-full pt-4 border-t border-border/40'
                }
            >
                <RecipeFilter
                    onFilterChange={setFilters}
                    availableCuisines={availableCuisines}
                    position={effectiveFilterPosition}
                    sticky={false}
                    showFavoritesFilter={effectiveShowFavorites}
                    leftAction={leftAction}
                />
            </div>
        );

    return (
        <div className={`flex flex-col w-full ${className}`}>
            {effectiveFilterPosition === 'top' && filterToolbar}

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

            {effectiveFilterPosition === 'bottom' && filterToolbar}
        </div>
    );
};
