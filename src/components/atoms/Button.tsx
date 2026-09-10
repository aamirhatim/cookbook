import React from 'react';
import { IconLoader2, type Icon, type IconProps } from '@tabler/icons-react';
import {
  type BaseButtonSharedProps,
  type ButtonWidth,
  BASE_BUTTON_CLASSES,
  getButtonVariantClasses,
  useButtonToggle,
} from './buttonStyles';

export type ButtonWidthOption = ButtonWidth | 'default' | 'expand' | 'min' | 'full-width' | 'min-width';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onToggle' | 'color'>,
    BaseButtonSharedProps {
  /** Text or content to display inside the button */
  text?: React.ReactNode;
  /** Alternate text displayed when active */
  activeText?: React.ReactNode;
  /** Optional icon */
  icon?: React.ComponentType<IconProps> | Icon;
  /** Alternate icon displayed when active */
  activeIcon?: React.ComponentType<IconProps> | Icon;
  /** Placement of icon relative to text */
  iconPosition?: 'left' | 'right';
  /** Width mode: auto (hugs content), fill (flex-1), or full (w-full) */
  width?: ButtonWidthOption;
  /** Custom icon size override (in px) */
  iconSize?: number;
  /** Custom icon stroke override */
  iconStroke?: number;
  /** When true, collapses inactive button to icon-only on mobile screens (< 640px) */
  collapseInactiveOnMobile?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  activeText,
  children,
  icon: InactiveIcon,
  activeIcon,
  iconPosition = 'left',
  width = 'auto',
  iconSize,
  iconStroke,
  size = 'medium',
  variant = 'subtle',
  color,
  active,
  defaultActive = false,
  isToggle = false,
  onToggle,
  onChange,
  loading = false,
  activeClassName = '',
  inactiveClassName = '',
  disabled = false,
  type = 'button',
  className = '',
  title,
  ariaLabel,
  collapseInactiveOnMobile = false,
  onClick,
  ...rest
}) => {
  const { isActive, shouldTrackToggle, handleToggleClick } = useButtonToggle({
    active,
    defaultActive,
    isToggle,
    onToggle,
    onChange,
  });

  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    handleToggleClick();
    onClick?.(e);
  };

  const CurrentIcon = isActive && activeIcon ? activeIcon : InactiveIcon;
  const EffectiveIcon = loading ? IconLoader2 : CurrentIcon;

  const contentText =
    isActive && activeText !== undefined ? activeText : text !== undefined ? text : children;

  const normalizedSize = size === 'default' ? 'medium' : size;
  const isCollapsedOnMobile = Boolean(collapseInactiveOnMobile && !isActive);

  const sizeClasses = (() => {
    if (isCollapsedOnMobile) {
      switch (normalizedSize) {
        case 'small':
          return 'h-9 min-h-[36px] w-9 min-w-[36px] p-0 aspect-square sm:aspect-auto sm:w-auto sm:min-w-0 sm:px-3 sm:py-1.5 rounded-lg text-xs gap-1.5';
        case 'large':
          return 'h-14 min-h-[56px] w-14 min-w-[56px] p-0 aspect-square sm:aspect-auto sm:w-auto sm:min-w-0 sm:px-6 sm:py-3 rounded-xl text-base gap-2.5';
        case 'medium':
        default:
          return 'h-11 min-h-[44px] w-11 min-w-[44px] p-0 aspect-square sm:aspect-auto sm:w-auto sm:min-w-0 sm:px-4 sm:py-2 rounded-lg text-sm gap-2';
      }
    }

    switch (normalizedSize) {
      case 'small':
        return 'h-9 min-h-[36px] px-3 py-1.5 rounded-lg text-xs gap-1.5';
      case 'large':
        return 'h-14 min-h-[56px] px-6 py-3 rounded-xl text-base gap-2.5';
      case 'medium':
      default:
        return 'h-11 min-h-[44px] px-4 py-2 rounded-lg text-sm gap-2';
    }
  })();

  const widthClasses = (() => {
    switch (width) {
      case 'full':
      case 'full-width':
        return 'w-full flex';
      case 'fill':
      case 'expand':
        return 'flex-1 flex';
      case 'auto':
      case 'min':
      case 'min-width':
      case 'default':
      default:
        return 'w-auto inline-flex';
    }
  })();

  const effectiveIconSize =
    iconSize ?? (normalizedSize === 'small' ? 16 : normalizedSize === 'large' ? 24 : 20);
  const effectiveIconStroke = iconStroke ?? 1.5;

  const variantClasses = getButtonVariantClasses(variant, isActive, shouldTrackToggle, color);
  const toggleCustomClasses = isActive ? activeClassName : inactiveClassName;

  const accessibleTitle =
    title || (typeof contentText === 'string' ? contentText : undefined);
  const accessibleAriaLabel = ariaLabel || accessibleTitle;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      title={accessibleTitle}
      aria-label={accessibleAriaLabel}
      aria-pressed={shouldTrackToggle ? isActive : undefined}
      className={`${widthClasses} ${BASE_BUTTON_CLASSES} ${sizeClasses} ${variantClasses} ${toggleCustomClasses} ${className}`.trim()}
      {...rest}
    >
      {iconPosition === 'left' && EffectiveIcon && (
        <EffectiveIcon
          size={effectiveIconSize}
          stroke={effectiveIconStroke}
          className={`shrink-0 ${loading ? 'animate-spin' : 'transition-transform active:scale-95'}`}
        />
      )}

      {contentText !== undefined && contentText !== null && (
        <span className={`truncate ${isCollapsedOnMobile ? 'hidden sm:inline' : ''}`}>
          {contentText}
        </span>
      )}

      {iconPosition === 'right' && EffectiveIcon && (
        <EffectiveIcon
          size={effectiveIconSize}
          stroke={effectiveIconStroke}
          className={`shrink-0 ${loading ? 'animate-spin' : 'transition-transform active:scale-95'}`}
        />
      )}
    </button>
  );
};

export default Button;
