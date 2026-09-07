import React from 'react';
import type { Ingredient } from '../../types/recipe';
import { Input } from '../atoms/Input';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { IconTrash } from '@tabler/icons-react';

export interface IngredientFormItemProps {
    ingredient: Ingredient;
    onChange: (field: keyof Ingredient, value: string | number) => void;
    onRemove: () => void;
}

export const IngredientFormItem: React.FC<IngredientFormItemProps> = ({
    ingredient,
    onChange,
    onRemove
}) => {
    return (
        <div className="flex flex-col gap-2 p-3 bg-surface rounded-xl border border-border/70 relative">
            <div className="flex gap-2 items-center w-full">
                <Input
                    type="number"
                    placeholder="Qty"
                    className="w-16 sm:w-20 flex-shrink-0 px-2 h-9"
                    value={ingredient.amount || ''}
                    onChange={(e) => onChange('amount', parseFloat(e.target.value) || 0)}
                />
                <Input
                    placeholder="Unit"
                    className="w-18 sm:w-24 flex-shrink-0 px-2 h-9"
                    value={ingredient.unit}
                    onChange={(e) => onChange('unit', e.target.value)}
                />
                <Input
                    placeholder="Name (e.g. olive oil)"
                    className="flex-1 min-w-0 h-9"
                    value={ingredient.name}
                    onChange={(e) => onChange('name', e.target.value)}
                />
            </div>
            <div className="flex gap-2 items-center w-full">
                <Input
                    placeholder="Notes (optional, e.g. extra virgin, warm)"
                    className="flex-1 min-w-0 text-sm h-9 bg-surface-hover/50"
                    value={ingredient.notes || ''}
                    onChange={(e) => onChange('notes', e.target.value)}
                />
                <ButtonIcon
                    icon={IconTrash}
                    size="small"
                    onClick={onRemove}
                    ariaLabel="Remove ingredient"
                    title="Remove ingredient"
                    className="shrink-0"
                />
            </div>
        </div>
    );
};
