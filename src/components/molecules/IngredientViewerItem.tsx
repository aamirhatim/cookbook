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

    const formattedQuantity = [
        ingredient.amount > 0 ? formatAmount(ingredient.amount) : '',
        ingredient.unit || ''
    ].filter(Boolean).join(' ');

    const accessibleLabel = `${ingredient.name}${formattedNotes ? ` ${formattedNotes}` : ''}${
        formattedQuantity ? `, ${formattedQuantity}` : ''
    }`;

    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            aria-label={accessibleLabel}
            onClick={onToggle}
            className={`w-full min-h-[44px] px-3 py-2.5 text-left flex items-center gap-3 transition-colors hover:bg-surface-hover active:bg-surface-hover/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isChecked ? 'bg-surface-hover/40' : ''
            }`}
        >
            {/* Checkbox indicator */}
            <span
                aria-hidden="true"
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                    isChecked
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-input bg-surface text-transparent'
                }`}
            >
                <IconCheck className="w-3.5 h-3.5" stroke={2.5} />
            </span>

            {/* Ingredient + Notes (Fixed Width) */}
            <div className="w-44 sm:w-60 shrink-0 text-sm leading-snug">
                <span className={`font-medium text-foreground ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                    {ingredient.name}
                </span>
                {formattedNotes && (
                    <span className={`text-muted-foreground ${isChecked ? 'line-through' : ''}`}>
                        {' '}{formattedNotes}
                    </span>
                )}
            </div>

            {/* Quantity */}
            {formattedQuantity && (
                <div
                    className={`flex-1 min-w-0 text-sm font-semibold text-foreground leading-snug ${isChecked ? 'line-through text-muted-foreground' : ''
                        }`}
                >
                    {formattedQuantity}
                </div>
            )}
        </button>
    );
};
