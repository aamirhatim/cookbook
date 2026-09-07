import React from 'react';
import { IconCheck } from '@tabler/icons-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className="peer appearance-none w-5 h-5 border border-input rounded-md bg-surface checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          />
          <IconCheck
            className="w-3.5 h-3.5 text-primary-foreground absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
            stroke={3}
          />
        </div>
        {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
