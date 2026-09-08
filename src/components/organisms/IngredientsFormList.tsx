import React from 'react';
import { IconFolderPlus } from '@tabler/icons-react';
import type { Ingredient, IngredientSection } from '../../types/recipe';
import { IngredientSectionCard } from '../molecules/IngredientSectionCard';

export interface IngredientsFormListProps {
    ingredients: IngredientSection[];
    onChange: (ingredients: IngredientSection[]) => void;
}

export const IngredientsFormList: React.FC<IngredientsFormListProps> = ({
    ingredients,
    onChange
}) => {
    // Ensure at least one section exists
    const sections = ingredients.length > 0 ? ingredients : [{ title: '', items: [] }];

    const updateSections = (newSections: IngredientSection[]) => {
        onChange(newSections);
    };

    const handleAddSection = () => {
        updateSections([
            ...sections,
            { title: '', items: [{ name: '', amount: 0, unit: '', notes: '' }] }
        ]);
    };

    const handleRemoveSection = (sectionIndex: number) => {
        const next = sections.filter((_, idx) => idx !== sectionIndex);
        updateSections(next.length > 0 ? next : [{ title: '', items: [] }]);
    };

    const handleMoveSection = (sectionIndex: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
        if (targetIndex < 0 || targetIndex >= sections.length) return;
        const next = [...sections];
        const [moved] = next.splice(sectionIndex, 1);
        next.splice(targetIndex, 0, moved);
        updateSections(next);
    };

    const handleChangeTitle = (sectionIndex: number, title: string) => {
        const next = [...sections];
        next[sectionIndex] = { ...next[sectionIndex], title };
        updateSections(next);
    };

    const handleAddItem = (sectionIndex: number) => {
        const next = [...sections];
        const currentItems = next[sectionIndex].items || [];
        next[sectionIndex] = {
            ...next[sectionIndex],
            items: [...currentItems, { name: '', amount: 0, unit: '', notes: '' }]
        };
        updateSections(next);
    };

    const handleChangeItem = (
        sectionIndex: number,
        itemIndex: number,
        field: keyof Ingredient,
        value: string | number
    ) => {
        const next = [...sections];
        const currentItems = [...(next[sectionIndex].items || [])];
        currentItems[itemIndex] = { ...currentItems[itemIndex], [field]: value };
        next[sectionIndex] = { ...next[sectionIndex], items: currentItems };
        updateSections(next);
    };

    const handleRemoveItem = (sectionIndex: number, itemIndex: number) => {
        const next = [...sections];
        const currentItems = (next[sectionIndex].items || []).filter((_, idx) => idx !== itemIndex);
        next[sectionIndex] = { ...next[sectionIndex], items: currentItems };
        updateSections(next);
    };

    const handleMoveItem = (
        sectionIndex: number,
        itemIndex: number,
        direction: 'up' | 'down'
    ) => {
        const next = sections.map((sec) => ({
            ...sec,
            items: [...(sec.items || [])]
        }));
        const currentItems = next[sectionIndex].items;
        const [movedItem] = currentItems.splice(itemIndex, 1);
        if (!movedItem) return;

        if (direction === 'up') {
            if (itemIndex > 0) {
                currentItems.splice(itemIndex - 1, 0, movedItem);
            } else if (sectionIndex > 0) {
                next[sectionIndex - 1].items.push(movedItem);
            } else {
                currentItems.unshift(movedItem);
                return;
            }
        } else {
            if (itemIndex < currentItems.length) {
                currentItems.splice(itemIndex + 1, 0, movedItem);
            } else if (sectionIndex < next.length - 1) {
                next[sectionIndex + 1].items.unshift(movedItem);
            } else {
                currentItems.push(movedItem);
                return;
            }
        }

        updateSections(next);
    };

    return (
        <div className="flex flex-col gap-4">
            {sections.map((section, idx) => (
                <IngredientSectionCard
                    key={idx}
                    section={section}
                    sectionIndex={idx}
                    totalSections={sections.length}
                    onChangeTitle={(title) => handleChangeTitle(idx, title)}
                    onAddItem={() => handleAddItem(idx)}
                    onChangeItem={(itemIdx, field, val) => handleChangeItem(idx, itemIdx, field, val)}
                    onRemoveItem={(itemIdx) => handleRemoveItem(idx, itemIdx)}
                    onRemoveSection={() => handleRemoveSection(idx)}
                    onMoveUp={() => handleMoveSection(idx, 'up')}
                    onMoveDown={() => handleMoveSection(idx, 'down')}
                    onMoveItem={(itemIdx, direction) => handleMoveItem(idx, itemIdx, direction)}
                />
            ))}

            <button
                type="button"
                onClick={handleAddSection}
                className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors bg-surface"
            >
                <IconFolderPlus className="w-5 h-5" stroke={1.5} />
                <span>Add Ingredient Section</span>
            </button>
        </div>
    );
};
