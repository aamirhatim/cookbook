import React, { useState, useEffect } from 'react';
import { Square, SquareCheck } from 'lucide-react';

export interface MultiSelectItemProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const MultiSelectItem: React.FC<MultiSelectItemProps> = ({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className = '',
}) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  useEffect(() => {
    if (isControlled) {
      setInternalChecked(checked);
    }
  }, [checked, isControlled]);

  const isSelected = isControlled ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const nextVal = !isSelected;
    if (!isControlled) {
      setInternalChecked(nextVal);
    }
    if (onChange) {
      onChange(nextVal);
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      disabled={disabled}
      onClick={handleToggle}
      className={`w-full min-h-[44px] px-3 py-2 flex items-center gap-3 rounded-md text-left transition-colors select-none ${
        disabled
          ? 'opacity-50 cursor-not-allowed text-muted-foreground'
          : 'hover:bg-surface-hover active:bg-surface-hover/80 text-foreground cursor-pointer'
      } ${className}`}
    >
      <span className="shrink-0 flex items-center justify-center">
        {isSelected ? (
          <SquareCheck className="w-5 h-5 text-primary" />
        ) : (
          <Square className="w-5 h-5 text-muted-foreground" />
        )}
      </span>
      {label && <span className="text-sm font-medium leading-none">{label}</span>}
    </button>
  );
};

