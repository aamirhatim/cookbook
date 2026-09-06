import React from 'react';
import { MultiSelectItem } from '../atoms/MultiSelectItem';
import { RadioSelectItem } from '../atoms/RadioSelectItem';

export interface DropdownItem {
  id: string;
  label: string;
  value: string;
}

export interface DropdownListProps {
  visible: boolean;
  type: 'radio' | 'multi';
  items: DropdownItem[];
  selectedValues: string | string[];
  onSelect: (value: string) => void;
  className?: string;
}

export const DropdownList: React.FC<DropdownListProps> = ({
  visible,
  type,
  items,
  selectedValues,
  onSelect,
  className = '',
}) => {
  if (!visible) return null;

  const isSelected = (val: string) => {
    if (Array.isArray(selectedValues)) {
      return selectedValues.includes(val);
    }
    return selectedValues === val;
  };

  return (
    <div
      role={type === 'radio' ? 'radiogroup' : 'group'}
      className={`absolute top-full mt-1.5 right-0 sm:left-0 sm:right-auto z-50 min-w-[200px] max-h-[280px] overflow-y-auto p-1.5 rounded-xl bg-surface border border-border shadow-xl focus:outline-none animate-in fade-in zoom-in-95 duration-100 ${className}`}
    >
      {items.length === 0 ? (
        <div className="px-3 py-2 text-xs text-muted-foreground text-center">
          No options available
        </div>
      ) : (
        items.map((item) =>
          type === 'radio' ? (
            <RadioSelectItem
              key={item.id}
              label={item.label}
              selected={isSelected(item.value)}
              onChange={() => onSelect(item.value)}
            />
          ) : (
            <MultiSelectItem
              key={item.id}
              label={item.label}
              checked={isSelected(item.value)}
              onChange={() => onSelect(item.value)}
            />
          )
        )
      )}
    </div>
  );
};

