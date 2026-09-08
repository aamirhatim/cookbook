import React from 'react';
import {
    IconChefHat,
    IconClock,
    IconFlame,
    IconUsers,
    IconCarrot,
    IconHexagonLetterE,
    IconHexagonLetterM,
    IconHexagonLetterH,
    IconTool,
    IconPlus,
    IconMinus,
} from '@tabler/icons-react';
import type { Recipe } from '../../types/recipe';

export interface RecipeViewerHeroProps {
    recipe: Recipe;
    className?: string;
    servings?: number;
    onServingsChange?: (servings: number) => void;
}

const difficultyIcons = {
    easy: IconHexagonLetterE,
    medium: IconHexagonLetterM,
    hard: IconHexagonLetterH,
} as const;

export const RecipeViewerHero: React.FC<RecipeViewerHeroProps> = ({
    recipe,
    className = '',
    servings: controlledServings,
    onServingsChange,
}) => {
    const baseServings = recipe.servings && recipe.servings > 0 ? recipe.servings : 1;
    const currentServings = controlledServings !== undefined ? controlledServings : baseServings;
    const prepMinutes = recipe.prepTimeMinutes ?? 0;
    const cookMinutes = recipe.cookTimeMinutes ?? 0;
    const totalTime = prepMinutes + cookMinutes;
    const DifficultyIcon = recipe.difficulty ? difficultyIcons[recipe.difficulty] : null;

    return (
        <section className={`space-y-4 ${className}`}>
            {/* Cover Image / Placeholder */}
            <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface-hover shadow-sm">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-56 sm:h-72 lg:h-80 object-cover"
                    />
                ) : (
                    <div className="w-full h-44 sm:h-56 flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <IconChefHat className="w-12 h-12 text-muted-foreground/60" stroke={1} />
                        <span className="text-xs font-medium uppercase tracking-wider">No photo provided</span>
                    </div>
                )}
            </div>

            {/* Title, Description & Tags */}
            <div className="space-y-2">
                {recipe.isPrivate && (
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                            Private
                        </span>
                    </div>
                )}

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                    {recipe.title}
                </h1>

                {recipe.description && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-1">
                        {recipe.description}
                    </p>
                )}

                {/* Dietary, Cuisine & Tags under description */}
                {(recipe.isVeg || recipe.cuisine || (recipe.tags && recipe.tags.length > 0)) && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {recipe.isVeg && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                <IconCarrot className="w-3.5 h-3.5" stroke={1.5} />
                                <span>Vegetarian</span>
                            </span>
                        )}
                        {recipe.cuisine && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 capitalize">
                                {recipe.cuisine}
                            </span>
                        )}
                        {recipe.tags && recipe.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-hover text-muted-foreground border border-border/60"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Metrics Bar */}
            <div
                className={`grid grid-cols-2 ${
                    DifficultyIcon ? 'sm:grid-cols-4 lg:grid-cols-2' : 'sm:grid-cols-3'
                } gap-2.5 p-3 rounded-xl bg-surface border border-border`}
            >
                {/* Prep Time */}
                <div
                    className="flex items-center gap-2.5"
                    title={totalTime > 0 ? `Total time: ${totalTime} min` : undefined}
                >
                    <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-muted-foreground shrink-0">
                        <IconClock className="w-4 h-4" stroke={1.5} />
                    </div>
                    <div className="text-xs">
                        <p className="text-muted-foreground">Prep Time</p>
                        <p className="font-semibold text-foreground">
                            {prepMinutes > 0
                                ? `${prepMinutes} min`
                                : totalTime > 0
                                ? '0 min'
                                : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Cook Time */}
                <div
                    className="flex items-center gap-2.5"
                    title={totalTime > 0 ? `Total time: ${totalTime} min` : undefined}
                >
                    <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-muted-foreground shrink-0">
                        <IconFlame className="w-4 h-4" stroke={1.5} />
                    </div>
                    <div className="text-xs">
                        <p className="text-muted-foreground">Cook Time</p>
                        <p className="font-semibold text-foreground">
                            {cookMinutes > 0
                                ? `${cookMinutes} min`
                                : totalTime > 0
                                ? '0 min'
                                : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Servings */}
                <div className={`flex items-center gap-2 sm:gap-2.5 ${!DifficultyIcon ? 'col-span-2 sm:col-span-1' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-muted-foreground shrink-0">
                        <IconUsers className="w-4 h-4" stroke={1.5} />
                    </div>
                    <div className="text-xs min-w-0">
                        <p className="text-muted-foreground">Servings</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            {onServingsChange && (
                                <button
                                    type="button"
                                    onClick={() => onServingsChange(Math.max(1, currentServings - 1))}
                                    disabled={currentServings <= 1}
                                    className="w-5 h-5 rounded flex items-center justify-center bg-surface-hover hover:bg-surface border border-border text-muted-foreground hover:text-foreground active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
                                    aria-label="Decrease servings"
                                    title="Decrease servings"
                                >
                                    <IconMinus className="w-3 h-3" stroke={2.5} />
                                </button>
                            )}
                            <span className="font-semibold text-foreground text-center min-w-[14px]">
                                {currentServings}
                            </span>
                            {onServingsChange && (
                                <button
                                    type="button"
                                    onClick={() => onServingsChange(currentServings + 1)}
                                    className="w-5 h-5 rounded flex items-center justify-center bg-surface-hover hover:bg-surface border border-border text-muted-foreground hover:text-foreground active:scale-95 transition-all"
                                    aria-label="Increase servings"
                                    title="Increase servings"
                                >
                                    <IconPlus className="w-3 h-3" stroke={2.5} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Difficulty */}
                {DifficultyIcon && (
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-muted-foreground shrink-0">
                            <DifficultyIcon className="w-4 h-4" stroke={1.5} />
                        </div>
                        <div className="text-xs">
                            <p className="text-muted-foreground">Difficulty</p>
                            <p className="font-semibold text-foreground capitalize">
                                {recipe.difficulty}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Equipment */}
            {recipe.equipment && recipe.equipment.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
                    <IconTool className="w-3.5 h-3.5 text-muted-foreground shrink-0" stroke={1.5} />
                    <span className="text-muted-foreground">Tools:</span>
                    {recipe.equipment.map((item) => (
                        <span key={item} className="px-2 py-0.5 rounded-md bg-surface border border-border text-foreground font-medium">{item}</span>
                    ))}
                </div>
            )}
        </section>
    );
};
