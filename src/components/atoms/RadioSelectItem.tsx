import React, { useState, useEffect } from 'react';
import { IconCircle, IconCircleDot } from '@tabler/icons-react';

export interface RadioSelectItemProps {
  label?: string;
  selected?: boolean;
  defaultSelected?: boolean;
  onChange?: (selected: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const RadioSelectItem: React.FC<RadioSelectItemProps> = ({
  label,
  selected,
  defaultSelected = false,
  onChange,
  disabled = false,
  className = '',
}) => {
  const isControlled = selected !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultSelected);

  useEffect(() => {
    if (isControlled) {
      setInternalSelected(selected);
    }
  }, [selected, isControlled]);

  const isChecked = isControlled ? selected : internalSelected;

  const handleClick = () => {
    if (disabled) return;
    if (!isControlled) {
      setInternalSelected(true);
    }
    if (onChange) {
      onChange(true);
    }
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleClick}
      className={`w-full min-h-[44px] px-3 py-2 flex items-center gap-3 rounded-md text-left transition-colors select-none ${
        disabled
          ? 'opacity-50 cursor-not-allowed text-muted-foreground'
          : 'hover:bg-surface-hover active:bg-surface-hover/80 text-foreground cursor-pointer'
      } ${className}`}
    >
      <span className="shrink-0 flex items-center justify-center">
        {isChecked ? (
          <IconCircleDot className="w-5 h-5 text-primary" stroke={1.5} />
        ) : (
          <IconCircle className="w-5 h-5 text-muted-foreground" stroke={1.5} />
        )}
      </span>
      {label && <span className="text-sm font-medium leading-none">{label}</span>}
    </button>
  );
};

