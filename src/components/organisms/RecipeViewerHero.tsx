import React from 'react';
import {
    IconChefHat,
    IconTool,
    IconPencil,
} from '@tabler/icons-react';
import type { Recipe } from '../../types/recipe';
import { IconButton } from '../atoms/IconButton';
import { FavoriteButton } from '../molecules/FavoriteButton';
import { RecipeInspiration } from '../molecules/RecipeInspiration';
import { RecipeDietaryBadges } from '../molecules/RecipeDietaryBadges';
import { RecipeMetricsBar } from '../molecules/RecipeMetricsBar';

export interface RecipeViewerHeroProps {
    recipe: Recipe;
    className?: string;
    servings?: number;
    onServingsChange?: (servings: number) => void;
    onEdit?: () => void;
}

export const RecipeViewerHero: React.FC<RecipeViewerHeroProps> = ({
    recipe,
    className = '',
    servings: controlledServings,
    onServingsChange,
    onEdit,
}) => {
    const baseServings = recipe.servings && recipe.servings > 0 ? recipe.servings : 1;
    const currentServings = controlledServings !== undefined ? controlledServings : baseServings;

    return (
        <section className={`space-y-4 ${className}`.trim()}>
            {/* Cover Image / Placeholder (Optimized for LCP) */}
            <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface-hover shadow-sm">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-56 sm:h-72 lg:h-80 object-cover"
                    />
                ) : (
                    <div className="w-full h-44 sm:h-56 flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <IconChefHat className="w-12 h-12 text-muted-foreground/60" stroke={1} />
                        <span className="text-xs font-medium uppercase tracking-wider">No photo provided</span>
                    </div>
                )}
            </div>

            {/* Title, Description & Dietary Badges */}
            <div className="space-y-2">
                {!recipe.isPublished && (
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                            Unpublished
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-5xl caacupe-one-regular text-foreground flex-1 min-w-0">
                        {recipe.title}
                    </h1>
                    <div className="flex items-center gap-2 shrink-0">
                        {onEdit && (
                            <IconButton
                                icon={IconPencil}
                                onClick={onEdit}
                                title="Edit recipe in admin editor"
                                ariaLabel="Edit recipe"
                                size="default"
                                variant="subtle"
                            />
                        )}
                        <FavoriteButton
                            recipeId={recipe.id}
                            recipeTitle={recipe.title}
                            size="default"
                            variant="subtle"
                            className="shrink-0"
                        />
                    </div>
                </div>

                <RecipeInspiration urls={recipe.urls} className="pt-0.5" />

                {recipe.description && (
                    <p className="text-sm sm:text-base domine text-muted-foreground leading-relaxed pt-1">
                        {recipe.description}
                    </p>
                )}

                <RecipeDietaryBadges
                    cuisine={recipe.cuisine}
                    isVeg={recipe.isVeg}
                    protein={recipe.protein}
                    tags={recipe.tags}
                />
            </div>

            {/* Quick Metrics Bar */}
            <RecipeMetricsBar
                prepMinutes={recipe.prepTimeMinutes}
                cookMinutes={recipe.cookTimeMinutes}
                servings={currentServings}
                onServingsChange={onServingsChange}
                difficulty={recipe.difficulty}
            />

            {/* Equipment */}
            {recipe.equipment && recipe.equipment.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
                    <IconTool className="w-3.5 h-3.5 text-muted-foreground shrink-0" stroke={1.5} />
                    <span className="text-muted-foreground">Tools:</span>
                    {recipe.equipment.map((item) => (
                        <span
                            key={item}
                            className="px-2 py-0.5 rounded-md bg-surface border border-border text-foreground font-medium"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            )}
        </section>
    );
};
