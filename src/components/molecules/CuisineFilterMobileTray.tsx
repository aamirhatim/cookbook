import React from 'react';

export interface CuisineOption {
    id: string;
    label: string;
    value: string;
}

export interface CuisineFilterMobileTrayProps {
    items: CuisineOption[];
    selectedValues: string[];
    onSelect: (value: string) => void;
    onClose?: () => void;
    className?: string;
}

export const CuisineFilterMobileTray: React.FC<CuisineFilterMobileTrayProps> = ({
    items,
    selectedValues,
    onSelect,
    className = '',
}) => {
    if (items.length === 0) {
        return (
            <div className="py-4 text-xs text-muted-foreground text-center">
                No cuisines available
            </div>
        );
    }

    return (
        <div
            role="group"
            aria-label="Filter recipes by cuisine"
            className={`w-full py-2 px-1 select-none ${className}`}
        >
            <div className="flex flex-wrap gap-1 items-center">
                {items.map((item) => {
                    const isSelected = selectedValues.includes(item.value);
                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="checkbox"
                            aria-checked={isSelected}
                            onClick={() => onSelect(item.value)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ${isSelected
                                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                                : 'bg-surface text-foreground/90 border-border hover:bg-surface-hover hover:border-border/80'
                                }`}
                        >
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
