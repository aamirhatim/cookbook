import React, { useState } from 'react';
import { IconCheck, IconRotate2, IconToolsKitchen } from '@tabler/icons-react';
import type { Ingredient } from '../../types/recipe';

export interface RecipeViewerIngredientsProps {
    ingredients: Ingredient[];
    className?: string;
}

export const RecipeViewerIngredients: React.FC<RecipeViewerIngredientsProps> = ({
    ingredients,
    className = '',
}) => {
    const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());

    const toggleIngredient = (index: number) => {
        setCheckedIndices((prev) => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const handleReset = () => {
        setCheckedIndices(new Set());
    };

    if (!ingredients || ingredients.length === 0) {
        return (
            <div className={`p-4 rounded-xl bg-surface border border-border text-center text-xs text-muted-foreground ${className}`}>
                No ingredients listed for this recipe.
            </div>
        );
    }

    return (
        <section className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IconToolsKitchen className="w-5 h-5 text-primary" stroke={1.5} />
                    <h2 className="text-lg font-bold text-foreground">Ingredients</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted-foreground font-medium">
                        {ingredients.length}
                    </span>
                </div>

                {checkedIndices.size > 0 && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        title="Reset checked ingredients"
                    >
                        <IconRotate2 className="w-3.5 h-3.5" stroke={1.5} />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            <div className="rounded-2xl bg-surface border border-border divide-y divide-border/50 overflow-hidden shadow-sm">
                {ingredients.map((ing, idx) => {
                    const isChecked = checkedIndices.has(idx);
                    return (
                        <button
                            key={`${ing.name}-${idx}`}
                            type="button"
                            onClick={() => toggleIngredient(idx)}
                            className={`w-full min-h-[48px] px-4 py-3 text-left flex items-start gap-3 transition-colors hover:bg-surface-hover active:bg-surface-hover/80 ${
                                isChecked ? 'bg-surface-hover/40' : ''
                            }`}
                        >
                            {/* Check circle */}
                            <span
                                className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                                    isChecked
                                        ? 'bg-primary border-primary text-primary-foreground'
                                        : 'border-input bg-surface text-transparent'
                                }`}
                            >
                                <IconCheck className="w-3.5 h-3.5" stroke={2.5} />
                            </span>

                            {/* Ingredient Details */}
                            <div className="flex-1 text-sm leading-snug">
                                <span className={`font-semibold text-foreground ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                    {ing.amount > 0 ? `${ing.amount} ` : ''}
                                    {ing.unit ? `${ing.unit} ` : ''}
                                </span>
                                <span className={`text-foreground ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                    {ing.name}
                                </span>
                                {ing.notes && (
                                    <span className={`block text-xs text-muted-foreground mt-0.5 ${isChecked ? 'line-through' : ''}`}>
                                        ({ing.notes})
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};
