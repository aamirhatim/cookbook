import React, { useState } from 'react';
import { IconLoader2, type Icon, type IconProps } from '@tabler/icons-react';

export type ButtonIconVariant =
  | 'subtle'
  | 'solid'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'destructive-subtle'
  | 'outline'
  | 'ghost'
  | 'fab'
  | 'small';

export type ButtonIconSize = 'default' | 'small';

export type ButtonIconWidth =
  | 'full'
  | 'expand'
  | 'min'
  | 'full-width'
  | 'min-width'
  | 'fill'
  | 'auto';

export interface ButtonIconProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onToggle'> {
  icon?: React.ComponentType<IconProps> | Icon;
  activeIcon?: React.ComponentType<IconProps> | Icon;
  iconPosition?: 'left' | 'right';
  text?: React.ReactNode;
  activeText?: React.ReactNode;
  children?: React.ReactNode;
  width?: ButtonIconWidth;
  loading?: boolean;
  iconSize?: number;
  iconStroke?: number;
  active?: boolean;
  defaultActive?: boolean;
  isToggle?: boolean;
  onToggle?: (active: boolean) => void;
  onChange?: (active: boolean) => void;
  variant?: ButtonIconVariant;
  size?: ButtonIconSize;
  title?: string;
  ariaLabel?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon: InactiveIcon,
  activeIcon,
  iconPosition = 'left',
  text,
  activeText,
  children,
  width,
  loading = false,
  iconSize,
  iconStroke,
  active: controlledActive,
  defaultActive = false,
  isToggle = false,
  onToggle,
  onChange,
  variant = 'subtle',
  size = 'default',
  type = 'button',
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
  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

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
  const EffectiveIcon = loading ? IconLoader2 : CurrentIcon;
  const contentText = (isActive && activeText !== undefined) ? activeText : (text !== undefined ? text : children);
  const hasText = contentText !== undefined && contentText !== null && contentText !== '';
  const hasIcon = Boolean(EffectiveIcon);
  const isIconOnly = hasIcon && !hasText;

  const isSmall = size === 'small' || variant === 'small';
  const isFab = variant === 'fab';
  const effectiveIconSize = iconSize ?? (isFab ? 24 : isSmall ? 16 : 20);
  const effectiveIconStroke = iconStroke ?? 1;

  // Normalized variant
  const normalizedVariant: ButtonIconVariant = variant === 'small' ? 'subtle' : variant;

  // Semantic styles for active and inactive states
  const getVariantStyles = () => {
    switch (normalizedVariant) {
      case 'solid':
      case 'primary':
        if (shouldTrackToggle) {
          return isActive
            ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-sm'
            : 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-foreground active:bg-surface-hover';
        }
        return 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-sm active:bg-primary/80';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80 shadow-xs active:bg-secondary/70';
      case 'destructive':
        return 'bg-destructive text-destructive-foreground border-transparent hover:bg-destructive/90 shadow-xs active:bg-destructive/80';
      case 'destructive-subtle':
        return 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/15 active:bg-destructive/20';
      case 'outline':
        return 'bg-transparent text-foreground border-border hover:bg-surface-hover active:bg-surface-hover';
      case 'ghost':
        return 'bg-transparent text-foreground border-transparent hover:bg-surface-hover active:bg-surface-hover';
      case 'fab':
        return isActive
          ? 'bg-primary text-primary-foreground border-transparent hover:bg-primary/90 shadow-xl ring-2 ring-ring ring-offset-2 ring-offset-background'
          : 'bg-primary text-primary-foreground border-transparent hover:bg-primary/90 active:bg-primary/80 shadow-lg hover:shadow-xl';
      case 'subtle':
      default:
        return isActive
          ? 'bg-primary/15 text-primary border-primary/40 hover:bg-primary/20 shadow-xs'
          : 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-foreground active:bg-surface-hover';
    }
  };

  // Shape and sizing styles
  const shapeAndSizeStyles = (() => {
    if (isFab) {
      return isIconOnly
        ? 'fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full aspect-square shrink-0 p-0'
        : 'fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 h-14 min-h-[56px] px-6 rounded-full shadow-xl gap-2.5';
    }

    if (isSmall) {
      return isIconOnly
        ? 'w-9 h-9 min-w-[36px] min-h-[36px] rounded-lg aspect-square shrink-0 p-0'
        : 'h-9 min-h-[36px] px-3 py-1.5 rounded-lg text-xs gap-1.5';
    }

    return isIconOnly
      ? 'w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg aspect-square shrink-0 p-0'
      : 'h-11 min-h-[44px] px-4 py-2 rounded-lg text-sm gap-2';
  })();

  // Width styles: icon-only buttons are always square; buttons with text support width variants
  const widthStyles = (() => {
    if (isIconOnly) {
      return '';
    }

    switch (width) {
      case 'full':
      case 'full-width':
        return 'w-full';
      case 'expand':
      case 'fill':
        return 'flex-1';
      case 'min':
      case 'min-width':
      case 'auto':
      default:
        return 'w-fit';
    }
  })();

  const currentStyles = `${getVariantStyles()} ${isActive ? activeClassName : inactiveClassName}`;
  const accessibleTitle = title || (typeof contentText === 'string' ? contentText : undefined);
  const accessibleAriaLabel = ariaLabel || (isIconOnly ? title : undefined);

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      title={accessibleTitle}
      aria-label={accessibleAriaLabel}
      aria-pressed={shouldTrackToggle ? isActive : undefined}
      className={`items-center justify-center border font-medium select-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring ${
        isFab ? 'flex focus:ring-offset-2' : (width === 'full' || width === 'expand' ? 'flex focus:ring-offset-1' : 'inline-flex focus:ring-offset-1')
      } disabled:opacity-50 disabled:cursor-not-allowed ${shapeAndSizeStyles} ${widthStyles} ${currentStyles} ${className}`}
      {...rest}
    >
      {hasIcon && iconPosition === 'left' && EffectiveIcon && (
        <EffectiveIcon
          size={effectiveIconSize}
          stroke={effectiveIconStroke}
          className={`shrink-0 ${loading ? 'animate-spin' : 'transition-transform active:scale-95'}`}
        />
      )}

      {hasText && (
        <span className="truncate">{contentText}</span>
      )}

      {hasIcon && iconPosition === 'right' && EffectiveIcon && (
        <EffectiveIcon
          size={effectiveIconSize}
          stroke={effectiveIconStroke}
          className={`shrink-0 ${loading ? 'animate-spin' : 'transition-transform active:scale-95'}`}
        />
      )}

      {!hasIcon && !hasText && (
        <span className="text-xs font-mono text-muted-foreground">?</span>
      )}
    </button>
  );
};

export default ButtonIcon;
