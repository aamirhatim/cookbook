import React from 'react';
import { RecipeRowItem } from '../atoms/RecipeRowItem';
import type { Recipe } from '../../types/recipe';
import { Utensils } from 'lucide-react';

export interface RecipeListProps {
  recipes: Recipe[];
  onRecipeClick?: (recipe: Recipe) => void;
  emptyMessage?: string;
  className?: string;
}

export const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  onRecipeClick,
  emptyMessage = 'No recipes found matching your filters.',
  className = '',
}) => {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-surface border border-dashed border-border">
        <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center text-muted-foreground mb-3">
          <Utensils className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Try adjusting your search or filters to see more recipes.
        </p>
      </div>
    );
  }

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
};

