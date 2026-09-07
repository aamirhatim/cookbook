import React from 'react';
import type { Icon, IconProps } from '@tabler/icons-react';
import { MultiSelectItem } from '../atoms/MultiSelectItem';
import { RadioSelectItem } from '../atoms/RadioSelectItem';

export interface DropdownItem {
  id: string;
  label: string;
  value: string;
}

export interface DropdownListProps {
  visible: boolean;
  title?: string;
  icon?: React.ComponentType<IconProps> | Icon;
  type: 'radio' | 'multi';
  items: DropdownItem[];
  selectedValues: string | string[];
  onSelect: (value: string) => void;
  className?: string;
  placement?: 'top' | 'bottom';
}

export const DropdownList: React.FC<DropdownListProps> = ({
  visible,
  title,
  icon: IconComponent,
  type,
  items,
  selectedValues,
  onSelect,
  className = '',
  placement = 'bottom',
}) => {
  if (!visible) return null;

  const isSelected = (val: string) => {
    if (Array.isArray(selectedValues)) {
      return selectedValues.includes(val);
    }
    return selectedValues === val;
  };

  const positionClass =
    placement === 'top'
      ? 'bottom-full mb-2 right-0'
      : 'top-full mt-1.5 right-0 sm:left-0 sm:right-auto';

  return (
    <div
      role={type === 'radio' ? 'radiogroup' : 'group'}
      aria-label={title}
      className={`absolute ${positionClass} z-50 min-w-[200px] flex flex-col rounded-xl bg-surface border border-border shadow-xl focus:outline-none animate-in fade-in zoom-in-95 duration-100 ${className}`}
    >
      {title && (
        <div className="px-3 py-2 flex items-center gap-2 border-b border-border/40 select-none">
          {IconComponent && <IconComponent size={15} className="text-primary shrink-0" stroke={1} />}
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
        </div>
      )}

      <div className="max-h-[240px] overflow-y-auto p-1.5 flex flex-col">
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
    </div>
  );
};

