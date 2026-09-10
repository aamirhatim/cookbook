import React from 'react';
import {
    IconStopwatch,
    IconChefHat,
    IconHexagonLetterE,
    IconHexagonLetterM,
    IconHexagonLetterH,
    IconCarrot,
    IconWorldMap,
} from '@tabler/icons-react';
import type { Recipe, ProteinType } from '../../types/recipe';
import { Chip } from '../atoms/Chip';
import { FavoriteButton } from '../molecules/FavoriteButton';
import { PROTEIN_ICON_MAP, PROTEIN_LABEL_MAP } from '../atoms/proteinIcons';

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    const DifficultyIcon = recipe.difficulty ? difficultyIcons[recipe.difficulty] : null;
    const proteinList = (recipe.protein || []).filter((p): p is ProteinType => Boolean(PROTEIN_ICON_MAP[p]));

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-label={`Recipe: ${recipe.title}`}
            className={`w-full text-left flex flex-col rounded-2xl bg-surface border border-border hover:border-border/80 hover:shadow-md transition-all duration-200 group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] cursor-pointer ${className}`}
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
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between pointer-events-none gap-2">
                    <div className="flex items-center gap-1.5">
                        {recipe.cuisine && (
                            <Chip
                                icon={IconWorldMap}
                                text={recipe.cuisine}
                                color="purple"
                                bgColor="purple-bg"
                                capitalize
                                className="backdrop-blur-md shadow-xs"
                            />
                        )}
                        {!recipe.isPublished && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground shadow-sm">
                                Unpublished
                            </span>
                        )}
                    </div>

                    <div className="pointer-events-auto">
                        <FavoriteButton
                            recipeId={recipe.id}
                            recipeTitle={recipe.title}
                            size="small"
                            className="bg-background/85 backdrop-blur-md shadow-sm border border-border/50 hover:bg-background"
                        />
                    </div>
                </div>

                {/* Floating Bottom Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none flex-wrap justify-end max-w-[85%]">
                        {(recipe.tags.length <= 3 ? recipe.tags : recipe.tags.slice(0, 2)).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full text-xs font-medium bg-background/85 backdrop-blur-md text-foreground border border-border/50 shadow-sm capitalize"
                            >
                                {tag}
                            </span>
                        ))}
                        {recipe.tags.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-background/85 backdrop-blur-md text-foreground/80 border border-border/50 shadow-sm">
                                +{recipe.tags.length - 2}
                            </span>
                        )}
                    </div>
                )}
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
                    <div className="flex items-center gap-1 min-w-0">
                        <IconStopwatch className="w-3.5 h-3.5 shrink-0" stroke={1.5} />
                        <span className="truncate">
                            {totalTime > 0
                                ? `Prep: ${recipe.prepTimeMinutes || 0}m, Cook: ${recipe.cookTimeMinutes || 0}m`
                                : 'Quick prep'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {DifficultyIcon && (
                            <div
                                className="flex items-center gap-1 capitalize"
                                title={`Difficulty: ${recipe.difficulty}`}
                            >
                                <DifficultyIcon className="w-3.5 h-3.5" stroke={1.5} />
                                <span className="hidden sm:inline">{recipe.difficulty}</span>
                            </div>
                        )}

                        {DifficultyIcon && (recipe.isVeg || proteinList.length > 0) && <span>•</span>}

                        {(recipe.isVeg || proteinList.length > 0) && (
                            <div className="flex items-center gap-1">
                                {recipe.isVeg && (
                                    <span
                                        className="flex items-center"
                                        title="Vegetarian"
                                        aria-label="Vegetarian"
                                    >
                                        <IconCarrot className="w-3.5 h-3.5" stroke={1.5} />
                                    </span>
                                )}
                                {proteinList.map((protein) => {
                                    const ProteinIcon = PROTEIN_ICON_MAP[protein];
                                    return (
                                        <span
                                            key={protein}
                                            className="flex items-center"
                                            title={PROTEIN_LABEL_MAP[protein]}
                                            aria-label={PROTEIN_LABEL_MAP[protein]}
                                        >
                                            <ProteinIcon className="w-3.5 h-3.5" stroke={1.5} />
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
