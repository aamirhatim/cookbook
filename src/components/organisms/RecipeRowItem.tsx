import React from 'react';
import {
    IconStopwatch,
    IconChefHat,
    IconCarrot,
    IconGlobe,
} from '@tabler/icons-react';
import type { Recipe, ProteinType } from '../../types/recipe';
import { Chip } from '../atoms/Chip';
import { FavoriteButton } from '../molecules/FavoriteButton';
import { PROTEIN_ICON_MAP, PROTEIN_LABEL_MAP } from '../atoms/proteinIcons';
import { DIFFICULTY_ICON_MAP } from '../atoms/difficultyIcons';

export interface RecipeRowItemProps {
    recipe: Recipe;
    onClick?: (recipe: Recipe) => void;
    className?: string;
}

export const RecipeRowItem: React.FC<RecipeRowItemProps> = ({
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

    const DifficultyIcon = recipe.difficulty ? DIFFICULTY_ICON_MAP[recipe.difficulty] : null;
    const proteinList = (recipe.protein || []).filter((p): p is ProteinType => Boolean(PROTEIN_ICON_MAP[p]));

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-label={`Recipe: ${recipe.title}`}
            className={`w-full text-left rounded-xl bg-surface border border-border hover:bg-surface-hover hover:border-border/80 transition-all flex flex-col shadow-sm overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${className}`}
        >
            {/* Top Image banner */}
            <div className="w-full h-[120px] overflow-hidden bg-surface-hover border-b border-border shrink-0 relative">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <IconChefHat className="w-6 h-6" stroke={1} />
                    </div>
                )}

                {/* Floating Top Right Favorite Button */}
                <div className="absolute top-2.5 right-2.5 z-10">
                    <FavoriteButton
                        recipeId={recipe.id}
                        recipeTitle={recipe.title}
                        size="small"
                        className="bg-background/85 backdrop-blur-md shadow-sm border border-border/50 hover:bg-background"
                    />
                </div>
            </div>

            {/* Content Details */}
            <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-center min-w-0 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-3xl caacupe-one-regular text-foreground truncate max-w-full group-hover:text-primary transition-colors">
                        {recipe.title}
                    </h3>
                    {!recipe.isPublished && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium shrink-0">
                            Unpublished
                        </span>
                    )}
                </div>

                {(recipe.cuisine || (recipe.tags && recipe.tags.length > 0)) && (
                    <div className="flex items-center gap-1.5 mt-1.5 flex-nowrap overflow-hidden">
                        {recipe.cuisine && (
                            <Chip
                                icon={IconGlobe}
                                text={recipe.cuisine}
                                color="purple"
                                bgColor="purple-bg"
                                capitalize
                                className="shrink-0"
                            />
                        )}
                        {recipe.tags?.filter(Boolean).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full text-xs font-medium bg-background border border-border/70 text-foreground capitalize shrink-0"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground flex-wrap">
                    {totalTime > 0 && (
                        <span className="flex items-center gap-1">
                            <IconStopwatch className="w-3.5 h-3.5" stroke={1} />
                            Prep: {recipe.prepTimeMinutes || 0}m, Cook: {recipe.cookTimeMinutes || 0}m
                        </span>
                    )}
                    {totalTime > 0 && DifficultyIcon && <span>•</span>}
                    {DifficultyIcon && (
                        <span
                            className="flex items-center text-muted-foreground"
                            title={`Difficulty: ${recipe.difficulty}`}
                            aria-label={`Difficulty: ${recipe.difficulty}`}
                        >
                            <DifficultyIcon className="w-3.5 h-3.5" stroke={1} />
                        </span>
                    )}
                    {(totalTime > 0 || DifficultyIcon) && (recipe.isVeg || proteinList.length > 0) && <span>•</span>}
                    {(recipe.isVeg || proteinList.length > 0) && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                            {recipe.isVeg && (
                                <span
                                    className="flex items-center text-muted-foreground"
                                    title="Vegetarian"
                                    aria-label="Vegetarian"
                                >
                                    <IconCarrot className="w-3.5 h-3.5" stroke={1} />
                                </span>
                            )}
                            {proteinList.map((protein) => {
                                const ProteinIcon = PROTEIN_ICON_MAP[protein];
                                return (
                                    <span
                                        key={protein}
                                        className="flex items-center text-muted-foreground"
                                        title={PROTEIN_LABEL_MAP[protein]}
                                        aria-label={PROTEIN_LABEL_MAP[protein]}
                                    >
                                        <ProteinIcon className="w-3.5 h-3.5" stroke={1} />
                                    </span>
                                );
                            })}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
