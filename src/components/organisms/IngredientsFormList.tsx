import React from 'react';
import { IconFolderPlus } from '@tabler/icons-react';
import type { Ingredient, IngredientSection } from '../../types/recipe';
import { IngredientSectionCard } from '../molecules/IngredientSectionCard';
import { useSectionList } from '../../hooks/useSectionList';

export interface IngredientsFormListProps {
    ingredients: IngredientSection[];
    onChange: (ingredients: IngredientSection[]) => void;
}

export const IngredientsFormList: React.FC<IngredientsFormListProps> = ({
    ingredients,
    onChange
}) => {
    const {
        sections,
        handleAddSection,
        handleRemoveSection,
        handleMoveSection,
        handleChangeTitle,
        handleAddItem,
        handleUpdateItem,
        handleRemoveItem,
        handleMoveItem,
    } = useSectionList<Ingredient, IngredientSection>({
        sections: ingredients,
        onChange,
        getItems: (s) => s.items || [],
        setItems: (s, items) => ({ ...s, items }),
        createEmptyItem: () => ({ name: '', amount: 0, unit: '', notes: '' }),
        createEmptySection: () => ({
            title: '',
            items: [{ name: '', amount: 0, unit: '', notes: '' }]
        }),
    });

    const handleChangeField = (
        secIdx: number,
        itemIdx: number,
        field: keyof Ingredient,
        val: string | number
    ) => {
        const item = sections[secIdx].items[itemIdx];
        if (!item) return;
        handleUpdateItem(secIdx, itemIdx, { ...item, [field]: val });
    };

    return (
        <div className="flex flex-col gap-4 w-full min-w-0">
            {sections.map((section, idx) => (
                <IngredientSectionCard
                    key={idx}
                    section={section}
                    sectionIndex={idx}
                    totalSections={sections.length}
                    onChangeTitle={(title) => handleChangeTitle(idx, title)}
                    onAddItem={() => handleAddItem(idx)}
                    onChangeItem={(itemIdx, field, val) =>
                        handleChangeField(idx, itemIdx, field, val)
                    }
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
                className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <IconFolderPlus className="w-5 h-5" stroke={1.5} />
                <span>Add Ingredient Section</span>
            </button>
        </div>
    );
};
