import React from 'react';
import { icons } from 'lucide-react';

export type LucideIconName = keyof typeof icons;

export interface ButtonIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconName: LucideIconName;
  iconSize?: number;
  active?: boolean;
  title?: string;
  ariaLabel?: string;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  iconName,
  iconSize = 20,
  active = false,
  title,
  ariaLabel,
  className = '',
  onClick,
  disabled = false,
  ...rest
}) => {
  const IconComponent = icons[iconName];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title || ariaLabel}
      aria-label={ariaLabel || title}
      className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ${
        active
          ? 'bg-primary/10 text-primary border border-primary/30'
          : 'text-foreground hover:bg-surface-hover hover:text-foreground active:bg-surface-hover'
      } ${className}`}
      {...rest}
    >
      {IconComponent ? (
        <IconComponent size={iconSize} className="shrink-0" />
      ) : (
        <span className="text-xs font-mono text-muted-foreground">?</span>
      )}
    </button>
  );
};

