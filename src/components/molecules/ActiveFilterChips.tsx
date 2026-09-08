import React from 'react';
import { IconX, IconHeartFilled } from '@tabler/icons-react';
import type { Difficulty } from '../../types/recipe';

export interface ActiveFilterChipsProps {
  timeFilter: string;
  onRemoveTime: () => void;
  difficulties: Difficulty[];
  onRemoveDifficulty: (diff: Difficulty) => void;
  cuisines: string[];
  onRemoveCuisine: (cuisine: string) => void;
  isVeg: boolean;
  onRemoveVeg: () => void;
  onlyFavorites?: boolean;
  onRemoveFavorites?: () => void;
  onResetAll: () => void;
  className?: string;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  timeFilter,
  onRemoveTime,
  difficulties,
  onRemoveDifficulty,
  cuisines,
  onRemoveCuisine,
  isVeg,
  onRemoveVeg,
  onlyFavorites = false,
  onRemoveFavorites,
  onResetAll,
  className = '',
}) => {
  const hasActiveFilters =
    timeFilter !== 'all' ||
    difficulties.length > 0 ||
    cuisines.length > 0 ||
    isVeg ||
    onlyFavorites;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap text-xs ${className}`}>
      <span className="text-muted-foreground font-medium">Filters:</span>

      {onlyFavorites && (
        <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-surface border border-border text-foreground font-medium">
          <IconHeartFilled className="w-3.5 h-3.5 text-destructive" />
          Favorites
          {onRemoveFavorites && (
            <button
              type="button"
              onClick={onRemoveFavorites}
              className="w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-surface-hover transition-colors"
              aria-label="Remove favorites filter"
            >
              <IconX className="w-3 h-3" stroke={1.5} />
            </button>
          )}
        </span>
      )}

      {timeFilter !== 'all' && (
        <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-surface border border-border text-foreground font-medium">
          &lt; {timeFilter === '60' ? '1 hr' : `${timeFilter} min`}
          <button
            type="button"
            onClick={onRemoveTime}
            className="w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-surface-hover transition-colors"
            aria-label="Remove time filter"
          >
            <IconX className="w-3 h-3" stroke={1.5} />
          </button>
        </span>
      )}

      {difficulties.map((diff) => (
        <span
          key={diff}
          className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-surface border border-border text-foreground font-medium capitalize"
        >
          {diff}
          <button
            type="button"
            onClick={() => onRemoveDifficulty(diff)}
            className="w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-surface-hover transition-colors"
            aria-label={`Remove ${diff} filter`}
          >
            <IconX className="w-3 h-3" stroke={1.5} />
          </button>
        </span>
      ))}

      {cuisines.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-surface border border-border text-foreground font-medium capitalize"
        >
          {c}
          <button
            type="button"
            onClick={() => onRemoveCuisine(c)}
            className="w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-surface-hover transition-colors"
            aria-label={`Remove ${c} filter`}
          >
            <IconX className="w-3 h-3" stroke={1.5} />
          </button>
        </span>
      ))}

      {isVeg && (
        <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-surface border border-border text-foreground font-medium">
          Vegetarian
          <button
            type="button"
            onClick={onRemoveVeg}
            className="w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-surface-hover transition-colors"
            aria-label="Remove vegetarian filter"
          >
            <IconX className="w-3 h-3" stroke={1.5} />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={onResetAll}
        className="text-primary hover:underline font-medium min-h-[36px] px-2 flex items-center"
      >
        Clear all
      </button>
    </div>
  );
};
