import React from 'react';
import {
    IconClock,
    IconFlame,
    IconUsers,
    IconMinus,
    IconPlus,
} from '@tabler/icons-react';
import type { Difficulty } from '../../types/recipe';
import { DIFFICULTY_ICON_MAP } from '../atoms/difficultyIcons';

export interface RecipeMetricsBarProps {
    prepMinutes?: number;
    cookMinutes?: number;
    servings: number;
    onServingsChange?: (servings: number) => void;
    difficulty?: Difficulty;
    className?: string;
}

export const RecipeMetricsBar: React.FC<RecipeMetricsBarProps> = ({
    prepMinutes = 0,
    cookMinutes = 0,
    servings,
    onServingsChange,
    difficulty,
    className = '',
}) => {
    const totalTime = prepMinutes + cookMinutes;
    const DifficultyIcon = difficulty ? DIFFICULTY_ICON_MAP[difficulty] : null;

    return (
        <div
            className={`grid grid-cols-2 ${
                DifficultyIcon ? 'sm:grid-cols-4 lg:grid-cols-2' : 'sm:grid-cols-3'
            } gap-2.5 p-3 rounded-xl bg-surface border border-border ${className}`.trim()}
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
            <div
                className={`flex items-center gap-2 sm:gap-2.5 ${
                    !DifficultyIcon ? 'col-span-2 sm:col-span-1' : ''
                }`}
            >
                <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-muted-foreground shrink-0">
                    <IconUsers className="w-4 h-4" stroke={1.5} />
                </div>
                <div className="text-xs min-w-0">
                    <p className="text-muted-foreground">Servings</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        {onServingsChange && (
                            <button
                                type="button"
                                onClick={() => onServingsChange(Math.max(1, servings - 1))}
                                disabled={servings <= 1}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-surface-hover hover:bg-surface border border-border text-muted-foreground hover:text-foreground active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label="Decrease servings"
                                title="Decrease servings"
                            >
                                <IconMinus className="w-3.5 h-3.5" stroke={2} />
                            </button>
                        )}
                        <span className="font-semibold text-foreground text-center min-w-[20px] text-sm">
                            {servings}
                        </span>
                        {onServingsChange && (
                            <button
                                type="button"
                                onClick={() => onServingsChange(servings + 1)}
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
                            {difficulty}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
