import React from 'react';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className = '', label, htmlFor, error, helperText, children, ...props }, ref) => {
    return (
      <div ref={ref} className={`flex flex-col gap-1.5 ${className}`} {...props}>
        {label && (
          <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        {children}
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);
FormField.displayName = 'FormField';
