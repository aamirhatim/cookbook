import React from 'react';
import { IconPlus, IconTrash, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import type { Ingredient, IngredientSection } from '../../types/recipe';
import { Input } from '../atoms/Input';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { IngredientFormItem } from './IngredientFormItem';

export interface IngredientSectionCardProps {
    section: IngredientSection;
    sectionIndex: number;
    totalSections: number;
    onChangeTitle: (title: string) => void;
    onAddItem: () => void;
    onChangeItem: (itemIndex: number, field: keyof Ingredient, value: string | number) => void;
    onRemoveItem: (itemIndex: number) => void;
    onRemoveSection: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

export const IngredientSectionCard: React.FC<IngredientSectionCardProps> = ({
    section,
    sectionIndex,
    totalSections,
    onChangeTitle,
    onAddItem,
    onChangeItem,
    onRemoveItem,
    onRemoveSection,
    onMoveUp,
    onMoveDown
}) => {
    return (
        <div className="flex flex-col gap-3 p-3.5 sm:p-4 bg-surface-hover/60 rounded-2xl border border-border">
            {/* Section Header Controls */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder={totalSections > 1 ? 'Section Title (e.g. Sauce, Filling)' : 'Section Title (optional)'}
                    className="flex-1 font-semibold text-sm h-9 bg-surface"
                    value={section.title || ''}
                    onChange={(e) => onChangeTitle(e.target.value)}
                />

                {totalSections > 1 && (
                    <div className="flex items-center gap-1 shrink-0">
                        {onMoveUp && (
                            <ButtonIcon
                                icon={IconArrowUp}
                                size="small"
                                onClick={onMoveUp}
                                disabled={sectionIndex === 0}
                                ariaLabel="Move section up"
                                title="Move section up"
                            />
                        )}
                        {onMoveDown && (
                            <ButtonIcon
                                icon={IconArrowDown}
                                size="small"
                                onClick={onMoveDown}
                                disabled={sectionIndex === totalSections - 1}
                                ariaLabel="Move section down"
                                title="Move section down"
                            />
                        )}
                        <ButtonIcon
                            icon={IconTrash}
                            size="small"
                            onClick={onRemoveSection}
                            ariaLabel="Remove section"
                            title="Remove section"
                            variant="destructive"
                        />
                    </div>
                )}
            </div>

            {/* List of Ingredients */}
            <div className="flex flex-col gap-2.5">
                {section.items.map((item, itemIdx) => (
                    <IngredientFormItem
                        key={itemIdx}
                        ingredient={item}
                        onChange={(field, val) => onChangeItem(itemIdx, field, val)}
                        onRemove={() => onRemoveItem(itemIdx)}
                    />
                ))}

                {section.items.length === 0 && (
                    <div className="py-3 px-4 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
                        No ingredients in this section yet.
                    </div>
                )}
            </div>

            {/* Add Ingredient Button */}
            <button
                type="button"
                onClick={onAddItem}
                className="w-full py-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm"
            >
                <IconPlus className="w-4 h-4" stroke={2} />
                <span>{section.title ? `Add Ingredient to ${section.title}` : 'Add Ingredient'}</span>
            </button>
        </div>
    );
};
