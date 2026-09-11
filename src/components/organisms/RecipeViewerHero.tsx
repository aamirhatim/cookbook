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
    IconWorldMap,
    IconPencil,
} from '@tabler/icons-react';
import type { Recipe, ProteinType } from '../../types/recipe';
import { Chip } from '../atoms/Chip';
import { IconButton } from '../atoms/IconButton';
import { FavoriteButton } from '../molecules/FavoriteButton';
import { RecipeInspiration } from '../molecules/RecipeInspiration';
import { PROTEIN_ICON_MAP, PROTEIN_LABEL_MAP } from '../atoms/proteinIcons';

export interface RecipeViewerHeroProps {
    recipe: Recipe;
    className?: string;
    servings?: number;
    onServingsChange?: (servings: number) => void;
    onEdit?: () => void;
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
    onEdit,
}) => {
    const baseServings = recipe.servings && recipe.servings > 0 ? recipe.servings : 1;
    const currentServings = controlledServings !== undefined ? controlledServings : baseServings;
    const prepMinutes = recipe.prepTimeMinutes ?? 0;
    const cookMinutes = recipe.cookTimeMinutes ?? 0;
    const totalTime = prepMinutes + cookMinutes;
    const DifficultyIcon = recipe.difficulty ? difficultyIcons[recipe.difficulty] : null;
    const proteinList = (recipe.protein || []).filter((p): p is ProteinType => Boolean(PROTEIN_ICON_MAP[p]));

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

                {/* Cuisine, Dietary (Veg/Proteins) & Tags under description */}
                {(recipe.cuisine || recipe.isVeg || proteinList.length > 0 || (recipe.tags && recipe.tags.length > 0)) && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {/* 1. Cuisine */}
                        {recipe.cuisine && (
                            <Chip
                                icon={IconWorldMap}
                                text={recipe.cuisine}
                                color="purple"
                                bgColor="purple-bg"
                                capitalize
                            />
                        )}

                        {/* 2. Veg & Proteins */}
                        {recipe.isVeg && (
                            <Chip
                                icon={IconCarrot}
                                text="Vegetarian"
                                color="green-fg"
                                bgColor="green-bg"
                            />
                        )}
                        {proteinList.map((protein) => {
                            const ProteinIcon = PROTEIN_ICON_MAP[protein];
                            return (
                                <Chip
                                    key={protein}
                                    icon={ProteinIcon}
                                    text={PROTEIN_LABEL_MAP[protein]}
                                    color="blue-fg"
                                    bgColor="blue-bg"
                                />
                            );
                        })}

                        {/* 3. Actual Tags */}
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
                className={`grid grid-cols-2 ${DifficultyIcon ? 'sm:grid-cols-4 lg:grid-cols-2' : 'sm:grid-cols-3'
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
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {onServingsChange && (
                                <button
                                    type="button"
                                    onClick={() => onServingsChange(Math.max(1, currentServings - 1))}
                                    disabled={currentServings <= 1}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-surface-hover hover:bg-surface border border-border text-muted-foreground hover:text-foreground active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    aria-label="Decrease servings"
                                    title="Decrease servings"
                                >
                                    <IconMinus className="w-3.5 h-3.5" stroke={2} />
                                </button>
                            )}
                            <span className="font-semibold text-foreground text-center min-w-[20px] text-sm">
                                {currentServings}
                            </span>
                            {onServingsChange && (
                                <button
                                    type="button"
                                    onClick={() => onServingsChange(currentServings + 1)}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-surface-hover hover:bg-surface border border-border text-muted-foreground hover:text-foreground active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    aria-label="Increase servings"
                                    title="Increase servings"
                                >
                                    <IconPlus className="w-3.5 h-3.5" stroke={2} />
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
