import React from 'react';
import { RecipeRowItem } from '../atoms/RecipeRowItem';
import { RecipeTile } from '../atoms/RecipeTile';
import type { Recipe } from '../../types/recipe';
import { IconToolsKitchen2 } from '@tabler/icons-react';

export interface RecipeListProps {
  recipes: Recipe[];
  onRecipeClick?: (recipe: Recipe) => void;
  emptyMessage?: string;
  className?: string;
  viewMode?: 'responsive' | 'list' | 'tile';
}

export const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  onRecipeClick,
  emptyMessage = 'No recipes found matching your filters.',
  className = '',
  viewMode = 'responsive',
}) => {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-surface border border-dashed border-border">
        <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center text-muted-foreground mb-3">
          <IconToolsKitchen2 className="w-6 h-6" stroke={1} />
        </div>
        <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Try adjusting your search or filters to see more recipes.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className={`flex flex-col gap-2.5 w-full ${className}`}>
        {recipes.map((recipe) => (
          <RecipeRowItem
            key={recipe.id}
            recipe={recipe}
            onClick={onRecipeClick}
          />
        ))}
      </div>
    );
  }

  if (viewMode === 'tile') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full ${className}`}>
        {recipes.map((recipe) => (
          <RecipeTile
            key={recipe.id}
            recipe={recipe}
            onClick={onRecipeClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile view (< md): Row items */}
      <div className="flex flex-col gap-2.5 w-full md:hidden">
        {recipes.map((recipe) => (
          <RecipeRowItem
            key={recipe.id}
            recipe={recipe}
            onClick={onRecipeClick}
          />
        ))}
      </div>

      {/* Desktop view (>= md): Tile grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {recipes.map((recipe) => (
          <RecipeTile
            key={recipe.id}
            recipe={recipe}
            onClick={onRecipeClick}
          />
        ))}
      </div>
    </div>
  );
};

