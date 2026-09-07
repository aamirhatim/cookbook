import React from 'react';
import {
  IconStopwatch,
  IconChefHat,
  IconHexagonLetterE,
  IconHexagonLetterM,
  IconHexagonLetterH,
  IconCarrot,
} from '@tabler/icons-react';
import type { Recipe } from '../../types/recipe';

export interface RecipeRowItemProps {
  recipe: Recipe;
  onClick?: (recipe: Recipe) => void;
  className?: string;
}

const difficultyIcons = {
  easy: IconHexagonLetterE,
  medium: IconHexagonLetterM,
  hard: IconHexagonLetterH,
} as const;

export const RecipeRowItem: React.FC<RecipeRowItemProps> = ({
  recipe,
  onClick,
  className = '',
}) => {
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  // Inactive onClick behavior for now as specified in tasks
  const handleClick = () => {
    if (onClick) {
      onClick(recipe);
    }
  };

  const DifficultyIcon = recipe.difficulty ? difficultyIcons[recipe.difficulty] : null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Recipe: ${recipe.title}`}
      className={`w-full min-h-[56px] text-left p-3.5 sm:p-4 rounded-xl bg-surface border border-border hover:bg-surface-hover hover:border-border/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${className}`}
    >
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0 border border-border"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-surface-hover border border-border shrink-0 flex items-center justify-center text-muted-foreground">
            <IconChefHat className="w-6 h-6" stroke={1} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-foreground truncate max-w-full">
              {recipe.title}
            </h3>
            {recipe.isPrivate && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                Private
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
            {recipe.cuisine && (
              <span className="capitalize font-medium text-foreground/80">
                {recipe.cuisine}
              </span>
            )}
            {recipe.cuisine && totalTime > 0 && <span>•</span>}
            {totalTime > 0 && (
              <span className="flex items-center gap-1">
                <IconStopwatch className="w-3.5 h-3.5" stroke={1} />
                {totalTime}m
              </span>
            )}
            {(recipe.cuisine || totalTime > 0) && DifficultyIcon && <span>•</span>}
            {DifficultyIcon && (
              <span
                className="flex items-center text-muted-foreground"
                title={`Difficulty: ${recipe.difficulty}`}
                aria-label={`Difficulty: ${recipe.difficulty}`}
              >
                <DifficultyIcon className="w-3.5 h-3.5" stroke={1.5} />
              </span>
            )}
            {(recipe.cuisine || totalTime > 0 || DifficultyIcon) && recipe.isVeg && <span>•</span>}
            {recipe.isVeg && (
              <span
                className="flex items-center text-muted-foreground"
                title="Vegetarian"
                aria-label="Vegetarian"
              >
                <IconCarrot className="w-3.5 h-3.5" stroke={1.5} />
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

