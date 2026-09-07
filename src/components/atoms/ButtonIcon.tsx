import React, { useState } from 'react';
import type { Icon, IconProps } from '@tabler/icons-react';

export type ButtonIconVariant = 'subtle' | 'solid';

export interface ButtonIconProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onToggle'> {
  icon: React.ComponentType<IconProps> | Icon;
  activeIcon?: React.ComponentType<IconProps> | Icon;
  iconSize?: number;
  iconStroke?: number;
  active?: boolean;
  defaultActive?: boolean;
  isToggle?: boolean;
  onToggle?: (active: boolean) => void;
  onChange?: (active: boolean) => void;
  variant?: ButtonIconVariant;
  title?: string;
  ariaLabel?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon: InactiveIcon,
  activeIcon,
  iconSize = 20,
  iconStroke = 1,
  active: controlledActive,
  defaultActive = false,
  isToggle = false,
  onToggle,
  onChange,
  variant = 'subtle',
  title,
  ariaLabel,
  className = '',
  activeClassName = '',
  inactiveClassName = '',
  onClick,
  disabled = false,
  ...rest
}) => {
  const shouldTrackToggle = isToggle || defaultActive !== false || onToggle !== undefined;
  const isControlled = controlledActive !== undefined;
  const [internalActive, setInternalActive] = useState<boolean>(defaultActive);

  const isActive = isControlled ? Boolean(controlledActive) : (shouldTrackToggle ? internalActive : false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (shouldTrackToggle) {
      const nextState = !isActive;
      if (!isControlled) {
        setInternalActive(nextState);
      }
      onToggle?.(nextState);
      onChange?.(nextState);
    }

    onClick?.(e);
  };

  const CurrentIcon = isActive && activeIcon ? activeIcon : InactiveIcon;

  // Semantic styles for active and inactive states
  const variantStyles = {
    subtle: {
      active: 'bg-primary/15 text-primary border-primary/40 hover:bg-primary/20 shadow-xs',
      inactive: 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-foreground active:bg-surface-hover',
    },
    solid: {
      active: 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-sm',
      inactive: 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-foreground active:bg-surface-hover',
    },
  };

  const currentStyles = isActive
    ? `${variantStyles[variant].active} ${activeClassName}`
    : `${variantStyles[variant].inactive} ${inactiveClassName}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={title || ariaLabel}
      aria-label={ariaLabel || title}
      aria-pressed={shouldTrackToggle ? isActive : undefined}
      className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${currentStyles} ${className}`}
      {...rest}
    >
      {CurrentIcon ? (
        <CurrentIcon size={iconSize} stroke={iconStroke} className="shrink-0 transition-transform active:scale-95" />
      ) : (
        <span className="text-xs font-mono text-muted-foreground">?</span>
      )}
    </button>
  );
};

export default ButtonIcon;
