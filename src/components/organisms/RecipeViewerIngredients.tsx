import React, { useState } from 'react';
import { IconRotate2, IconToolsKitchen, IconChevronDown } from '@tabler/icons-react';
import type { IngredientSection } from '../../types/recipe';
import { IngredientViewerItem } from '../molecules/IngredientViewerItem';

export interface RecipeViewerIngredientsProps {
    ingredients: IngredientSection[];
    className?: string;
}

export const RecipeViewerIngredients: React.FC<RecipeViewerIngredientsProps> = ({
    ingredients,
    className = '',
}) => {
    const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
    const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());

    const totalCount = ingredients.reduce((acc, sec) => acc + (sec.items?.length || 0), 0);

    const toggleItem = (key: string) => {
        setCheckedKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const toggleSectionCollapse = (secIdx: number) => {
        setCollapsedSections((prev) => {
            const next = new Set(prev);
            if (next.has(secIdx)) {
                next.delete(secIdx);
            } else {
                next.add(secIdx);
            }
            return next;
        });
    };

    const handleReset = () => {
        setCheckedKeys(new Set());
    };

    if (!ingredients || totalCount === 0) {
        return (
            <div className={`p-4 rounded-xl bg-surface border border-border text-center text-xs text-muted-foreground ${className}`}>
                No ingredients listed for this recipe.
            </div>
        );
    }

    const hasSections = ingredients.length > 1 || ingredients.some((sec) => !!sec.title?.trim());

    return (
        <section className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IconToolsKitchen className="w-5 h-5 text-primary" stroke={1.5} />
                    <h2 className="text-lg font-bold text-foreground">Ingredients</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted-foreground font-medium">
                        {totalCount}
                    </span>
                </div>

                {checkedKeys.size > 0 && (
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

            <div className="space-y-4">
                {ingredients.map((sec, secIdx) => {
                    if (!sec.items || sec.items.length === 0) return null;
                    const isCollapsed = collapsedSections.has(secIdx);
                    const sectionTitle = sec.title?.trim() || (hasSections ? 'Main Ingredients' : '');

                    return (
                        <div key={secIdx} className="space-y-2">
                            {sectionTitle && (
                                <button
                                    type="button"
                                    onClick={() => toggleSectionCollapse(secIdx)}
                                    className="w-full flex items-center justify-between px-1 py-1 text-left select-none group focus:outline-none"
                                    aria-expanded={!isCollapsed}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <IconChevronDown
                                            className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'
                                                }`}
                                            stroke={2}
                                        />
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                                            {sectionTitle}
                                        </h3>
                                    </div>
                                    <span className="text-[11px] text-muted-foreground font-medium">
                                        {sec.items.length} {sec.items.length === 1 ? 'item' : 'items'}
                                    </span>
                                </button>
                            )}

                            {!isCollapsed && (
                                <div className="py-2 rounded-2xl bg-surface border border-border divide-y divide-border/50 overflow-hidden shadow-sm">
                                    {sec.items.map((ing, itemIdx) => {
                                        const key = `${secIdx}-${itemIdx}`;
                                        return (
                                            <IngredientViewerItem
                                                key={key}
                                                ingredient={ing}
                                                isChecked={checkedKeys.has(key)}
                                                onToggle={() => toggleItem(key)}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
