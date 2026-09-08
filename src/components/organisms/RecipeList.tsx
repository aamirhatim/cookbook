import React from 'react';
import { RecipeRowItem } from './RecipeRowItem';
import { RecipeTile } from './RecipeTile';
import { RecipeAdminRowItem } from './RecipeAdminRowItem';
import type { Recipe } from '../../types/recipe';
import { IconToolsKitchen2 } from '@tabler/icons-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export interface RecipeListProps {
  recipes: Recipe[];
  onRecipeClick?: (recipe: Recipe) => void;
  onEditRecipe?: (recipe: Recipe) => void;
  onDeleteRecipe?: (recipe: Recipe) => void;
  onTogglePublishRecipe?: (recipe: Recipe) => void;
  emptyMessage?: string;
  className?: string;
  viewMode?: 'responsive' | 'list' | 'tile' | 'admin';
}

export const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  onRecipeClick,
  onEditRecipe,
  onDeleteRecipe,
  onTogglePublishRecipe,
  emptyMessage = 'No recipes found matching your filters.',
  className = '',
  viewMode = 'responsive',
}) => {
  const isMobile = useIsMobile();

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

  if (viewMode === 'admin') {
    return (
      <div className={`flex flex-col divide-y divide-border border-y border-border w-full ${className}`}>
        {recipes.map((recipe) => (
          <RecipeAdminRowItem
            key={recipe.id}
            recipe={recipe}
            onEdit={onEditRecipe || onRecipeClick}
            onDelete={onDeleteRecipe}
            onTogglePublish={onTogglePublishRecipe}
            onClick={onRecipeClick}
          />
        ))}
      </div>
    );
  }

  const effectiveMode = viewMode === 'responsive' ? (isMobile ? 'list' : 'tile') : viewMode;

  if (effectiveMode === 'list') {
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
};
