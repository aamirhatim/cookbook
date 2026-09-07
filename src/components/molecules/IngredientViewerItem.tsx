import React from 'react';
import { IconCheck } from '@tabler/icons-react';
import type { Ingredient } from '../../types/recipe';

export interface IngredientViewerItemProps {
    ingredient: Ingredient;
    isChecked: boolean;
    onToggle: () => void;
}

export const IngredientViewerItem: React.FC<IngredientViewerItemProps> = ({
    ingredient,
    isChecked,
    onToggle
}) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`w-full min-h-[48px] px-4 py-3 text-left flex items-start gap-3 transition-colors hover:bg-surface-hover active:bg-surface-hover/80 ${
                isChecked ? 'bg-surface-hover/40' : ''
            }`}
        >
            {/* Checkbox indicator */}
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
                    {ingredient.amount > 0 ? `${ingredient.amount} ` : ''}
                    {ingredient.unit ? `${ingredient.unit} ` : ''}
                </span>
                <span className={`text-foreground ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                    {ingredient.name}
                </span>
                {ingredient.notes && (
                    <span className={`block text-xs text-muted-foreground mt-0.5 ${isChecked ? 'line-through' : ''}`}>
                        ({ingredient.notes})
                    </span>
                )}
            </div>
        </button>
    );
};
