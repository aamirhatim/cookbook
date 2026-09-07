import React, { useState } from 'react';
import type { Icon, IconProps } from '@tabler/icons-react';

export type ButtonIconVariant = 'subtle' | 'solid' | 'fab';

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
  iconSize,
  iconStroke,
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

  const isFab = variant === 'fab';
  const effectiveIconSize = iconSize ?? (isFab ? 24 : 20);
  const effectiveIconStroke = iconStroke ?? 1;

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
    fab: {
      active: 'bg-primary text-primary-foreground border-transparent hover:bg-primary/90 shadow-xl ring-2 ring-ring ring-offset-2 ring-offset-background',
      inactive: 'bg-primary text-primary-foreground border-transparent hover:bg-primary/90 active:bg-primary/80 shadow-lg hover:shadow-xl',
    },
  };

  const shapeAndPositionStyles = isFab
    ? 'fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full'
    : 'inline-flex min-w-[44px] min-h-[44px] rounded-lg';

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
      className={`items-center justify-center border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring ${
        isFab ? 'flex focus:ring-offset-2' : 'inline-flex focus:ring-offset-1'
      } disabled:opacity-50 disabled:cursor-not-allowed ${shapeAndPositionStyles} ${currentStyles} ${className}`}
      {...rest}
    >
      {CurrentIcon ? (
        <CurrentIcon size={effectiveIconSize} stroke={effectiveIconStroke} className="shrink-0 transition-transform active:scale-95" />
      ) : (
        <span className="text-xs font-mono text-muted-foreground">?</span>
      )}
    </button>
  );
};

export default ButtonIcon;
