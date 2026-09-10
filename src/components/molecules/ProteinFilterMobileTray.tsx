import React from 'react';
import { IconButton } from '../atoms/IconButton';
import type { ProteinFilterValue } from './recipeFilterConstants';
import { PROTEIN_FILTER_OPTIONS } from './recipeFilterConstants';

export interface ProteinFilterMobileTrayProps {
    selectedValues: ProteinFilterValue[] | string[];
    onSelect: (value: string) => void;
    onClose?: () => void;
    className?: string;
}

export const ProteinFilterMobileTray: React.FC<ProteinFilterMobileTrayProps> = ({
    selectedValues,
    onSelect,
    className = '',
}) => {
    const isSelected = (val: string) =>
        Array.isArray(selectedValues) ? selectedValues.includes(val as ProteinFilterValue) : selectedValues === val;

    return (
        <div
            role="group"
            aria-label="Filter recipes by protein and vegetarian options"
            className={`w-full py-2 px-1 select-none ${className}`}
        >
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3 items-center justify-items-center max-w-[380px] mx-auto">
                {PROTEIN_FILTER_OPTIONS.map((option) => {
                    const active = isSelected(option.value);
                    return (
                        <div
                            key={option.id}
                            className="flex flex-col items-center gap-1.5 w-full cursor-pointer"
                            onClick={() => onSelect(option.value)}
                        >
                            <IconButton
                                icon={option.icon}
                                active={active}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(option.value);
                                }}
                                title={option.description}
                                ariaLabel={option.description}
                                aria-pressed={active}
                                variant="subtle"
                                iconSize={28}
                                iconStroke={1}
                                className="w-full max-w-[60px] h-13 sm:h-14 min-w-[46px] min-h-[46px] rounded-xl flex items-center justify-center transition-all active:scale-95"
                            />
                            <span
                                className={`text-[11px] sm:text-xs transition-colors text-center leading-tight font-medium ${
                                    active ? 'text-primary font-semibold' : 'text-muted-foreground'
                                }`}
                            >
                                {option.shortLabel || option.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
