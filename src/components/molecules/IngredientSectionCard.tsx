import React from 'react';
import type { Ingredient, IngredientSection } from '../../types/recipe';
import { SectionCard } from './SectionCard';
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
    onMoveItem?: (itemIndex: number, direction: 'up' | 'down') => void;
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
    onMoveDown,
    onMoveItem
}) => {
    const itemCount = section.items.length;
    const namedItems = section.items.filter((i) => i.name?.trim()).map((i) => i.name.trim());
    const summaryList = namedItems.slice(0, 3).join(', ');
    const hasMore = namedItems.length > 3;

    const collapsedSummary = (
        <span>
            {itemCount} {itemCount === 1 ? 'ingredient' : 'ingredients'}
            {summaryList && ` (${summaryList}${hasMore ? '...' : ''})`}
        </span>
    );

    return (
        <SectionCard
            title={section.title || ''}
            sectionIndex={sectionIndex}
            totalSections={totalSections}
            titlePlaceholder="Section Title (e.g. Sauce, Filling)"
            itemCount={itemCount}
            collapsedSummaryText={collapsedSummary}
            emptyMessage="No ingredients in this section yet."
            addItemText={section.title ? `Add Ingredient to ${section.title}` : 'Add Ingredient'}
            onChangeTitle={onChangeTitle}
            onAddItem={onAddItem}
            onRemoveSection={onRemoveSection}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
        >
            {section.items.map((item, itemIdx) => {
                const isFirst = sectionIndex === 0 && itemIdx === 0;
                const isLast =
                    sectionIndex === totalSections - 1 &&
                    itemIdx === section.items.length - 1;

                return (
                    <IngredientFormItem
                        key={itemIdx}
                        ingredient={item}
                        onChange={(field, val) => onChangeItem(itemIdx, field, val)}
                        onRemove={() => onRemoveItem(itemIdx)}
                        onMoveUp={onMoveItem ? () => onMoveItem(itemIdx, 'up') : undefined}
                        onMoveDown={onMoveItem ? () => onMoveItem(itemIdx, 'down') : undefined}
                        isFirst={isFirst}
                        isLast={isLast}
                    />
                );
            })}
        </SectionCard>
    );
};
