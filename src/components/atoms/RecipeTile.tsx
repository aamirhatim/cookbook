import React from 'react';
import {
    IconStopwatch,
    IconChefHat,
    IconHexagonLetterE,
    IconHexagonLetterM,
    IconHexagonLetterH,
    IconCarrot,
    IconUsers,
} from '@tabler/icons-react';
import type { Recipe } from '../../types/recipe';

export interface RecipeTileProps {
    recipe: Recipe;
    onClick?: (recipe: Recipe) => void;
    className?: string;
}

const difficultyIcons = {
    easy: IconHexagonLetterE,
    medium: IconHexagonLetterM,
    hard: IconHexagonLetterH,
} as const;

export const RecipeTile: React.FC<RecipeTileProps> = ({
    recipe,
    onClick,
    className = '',
}) => {
    const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

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
            className={`w-full text-left flex flex-col rounded-2xl bg-surface border border-border hover:border-border/80 hover:shadow-md transition-all duration-200 group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] ${className}`}
        >
            {/* Cover Photo / Thumbnail */}
            <div className="aspect-[16/10] w-full overflow-hidden relative bg-surface-hover border-b border-border">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-1">
                        <IconChefHat className="w-10 h-10" stroke={1} />
                        <span className="text-[11px] font-medium tracking-wide uppercase">No Image</span>
                    </div>
                )}

                {/* Floating Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
                    {recipe.cuisine ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-background/85 backdrop-blur-md text-foreground border border-border/50 shadow-sm capitalize">
                            {recipe.cuisine}
                        </span>
                    ) : (
                        <span />
                    )}

                    <div className="flex items-center gap-1.5">
                        {recipe.isVeg && (
                            <span
                                className="p-1 rounded-full bg-background/85 backdrop-blur-md text-foreground border border-border/50 shadow-sm"
                                title="Vegetarian"
                                aria-label="Vegetarian"
                            >
                                <IconCarrot className="w-3.5 h-3.5" stroke={1.5} />
                            </span>
                        )}
                        {recipe.isPrivate && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground shadow-sm">
                                Private
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Info */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-3 w-full">
                <div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {recipe.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[2rem]">
                        {recipe.description || 'No description provided.'}
                    </p>
                </div>

                {/* Metrics Footer */}
                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <IconStopwatch className="w-3.5 h-3.5 shrink-0" stroke={1.5} />
                        <span>{totalTime > 0 ? `${totalTime}m total` : 'Quick prep'}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {recipe.servings ? (
                            <span className="flex items-center gap-0.5" title={`${recipe.servings} servings`}>
                                <IconUsers className="w-3.5 h-3.5" stroke={1.5} />
                                <span>{recipe.servings}</span>
                            </span>
                        ) : null}

                        {DifficultyIcon && (
                            <span
                                className="flex items-center gap-1 capitalize"
                                title={`Difficulty: ${recipe.difficulty}`}
                            >
                                <DifficultyIcon className="w-3.5 h-3.5" stroke={1.5} />
                                <span className="hidden sm:inline">{recipe.difficulty}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
};
