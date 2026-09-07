import React from 'react';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string;
  options: RadioOption[];
  value: string;
  onChangeValue: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    { className = '', name, options, value, onChangeValue, orientation = 'vertical', ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex ${
          orientation === 'horizontal' ? 'flex-row gap-4 flex-wrap' : 'flex-col gap-2'
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChangeValue(option.value)}
                className="peer appearance-none w-5 h-5 border border-input rounded-full bg-surface checked:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="w-2.5 h-2.5 rounded-full bg-primary absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity scale-50 peer-checked:scale-100 duration-200" />
            </div>
            <span className="text-sm font-medium text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';
