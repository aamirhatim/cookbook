import React from 'react';
import { IconCheck } from '@tabler/icons-react';
import type { Ingredient } from '../../types/recipe';
import { formatAmount } from '../../lib/formatAmount';

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
    const trimmedNotes = ingredient.notes?.trim();
    const formattedNotes = trimmedNotes
        ? trimmedNotes.startsWith('(') && trimmedNotes.endsWith(')')
            ? trimmedNotes
            : `(${trimmedNotes})`
        : null;

    return (
        <button
            type="button"
            onClick={onToggle}
            className={`w-full px-3 py-1.5 text-left flex items-center gap-3 transition-colors hover:bg-surface-hover active:bg-surface-hover/80 ${isChecked ? 'bg-surface-hover/40' : ''
                }`}
        >
            {/* Checkbox indicator */}
            <span
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${isChecked
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-input bg-surface text-transparent'
                    }`}
            >
                <IconCheck className="w-3.5 h-3.5" stroke={2.5} />
            </span>

            {/* Ingredient Details */}
            <div className="flex-1 text-sm leading-snug">
                <span className={`font-semibold text-foreground ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                    {ingredient.amount > 0 ? `${formatAmount(ingredient.amount)} ` : ''}
                    {ingredient.unit ? `${ingredient.unit} ` : ''}
                </span>
                <span className={`text-foreground ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                    {ingredient.name}
                </span>
                {formattedNotes && (
                    <span className={`text-muted-foreground ${isChecked ? 'line-through' : ''}`}>
                        {' '}{formattedNotes}
                    </span>
                )}
            </div>
        </button>
    );
};
