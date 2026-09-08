import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    const hasCustomWidth = /(?:^|\s)(w-|flex-)/.test(className);
    const hasCustomHeight = /(?:^|\s)h-/.test(className);
    const hasCustomPaddingX = /(?:^|\s)px-/.test(className);

    return (
      <input
        ref={ref}
        className={`min-w-0 ${hasCustomHeight ? '' : 'h-11'} ${
          hasCustomWidth ? '' : 'w-full'
        } rounded-lg border bg-surface ${
          hasCustomPaddingX ? '' : 'px-3'
        } py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? 'border-destructive focus-visible:ring-destructive' : 'border-border'
        } ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
