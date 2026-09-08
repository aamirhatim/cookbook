import React from 'react';
import type { Ingredient } from '../../types/recipe';
import { Input } from '../atoms/Input';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { IconTrash, IconArrowUp, IconArrowDown } from '@tabler/icons-react';

export interface IngredientFormItemProps {
    ingredient: Ingredient;
    onChange: (field: keyof Ingredient, value: string | number) => void;
    onRemove: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
}

export const IngredientFormItem: React.FC<IngredientFormItemProps> = ({
    ingredient,
    onChange,
    onRemove,
    onMoveUp,
    onMoveDown,
    isFirst = false,
    isLast = false
}) => {
    return (
        <div className="flex flex-col gap-2 p-3 bg-surface rounded-xl border border-border/70 relative">
            <div className="flex gap-2 items-center w-full">
                <Input
                    placeholder="Ingredient (e.g. olive oil)"
                    className="flex-1 min-w-0 h-9 placeholder:truncate"
                    value={ingredient.name}
                    onChange={(e) => onChange('name', e.target.value)}
                />
                <Input
                    type="number"
                    step="any"
                    placeholder="Qty"
                    className="w-14 sm:w-20 shrink-0 px-2 h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={ingredient.amount || ''}
                    onChange={(e) => onChange('amount', parseFloat(e.target.value) || 0)}
                />
                <Input
                    placeholder="Unit"
                    className="w-16 sm:w-24 shrink-0 px-2 h-9"
                    value={ingredient.unit}
                    onChange={(e) => onChange('unit', e.target.value)}
                />
            </div>
            <div className="flex gap-2 items-center w-full">
                <Input
                    placeholder="Notes (optional, e.g. extra virgin, warm)"
                    className="flex-1 min-w-0 text-sm h-9 bg-surface-hover/50"
                    value={ingredient.notes || ''}
                    onChange={(e) => onChange('notes', e.target.value)}
                />
                <div className="flex items-center gap-1 shrink-0">
                    <ButtonIcon
                        icon={IconArrowUp}
                        size="small"
                        onClick={onMoveUp}
                        disabled={isFirst}
                        ariaLabel="Move ingredient up"
                        title="Move ingredient up"
                    />
                    <ButtonIcon
                        icon={IconArrowDown}
                        size="small"
                        onClick={onMoveDown}
                        disabled={isLast}
                        ariaLabel="Move ingredient down"
                        title="Move ingredient down"
                    />
                    <ButtonIcon
                        icon={IconTrash}
                        size="small"
                        onClick={onRemove}
                        ariaLabel="Remove ingredient"
                        title="Remove ingredient"
                    />
                </div>
            </div>
        </div>
    );
};
