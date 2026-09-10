import React from 'react';
import { IconLoader2, type Icon, type IconProps } from '@tabler/icons-react';
import {
    type BaseButtonSharedProps,
    BASE_BUTTON_CLASSES,
    getButtonVariantClasses,
    useButtonToggle,
} from './buttonStyles';

export interface IconButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onToggle' | 'color'>,
    BaseButtonSharedProps {
    /** Icon to render */
    icon: React.ComponentType<IconProps> | Icon;
    /** Alternate icon displayed when active */
    activeIcon?: React.ComponentType<IconProps> | Icon;
    /** Accessible tooltip text and default aria-label */
    title?: string;
    /** Accessible aria-label override */
    ariaLabel?: string;
    /** Custom icon size override (in px) */
    iconSize?: number;
    /** Custom icon stroke override */
    iconStroke?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon: InactiveIcon,
    activeIcon,
    title,
    ariaLabel,
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

    const normalizedSize = size === 'default' ? 'medium' : size;

    const sizeClasses = (() => {
        switch (normalizedSize) {
            case 'small':
                return 'w-9 h-9 min-w-[36px] min-h-[36px] rounded-lg';
            case 'large':
                return 'w-14 h-14 min-w-[56px] min-h-[56px] rounded-xl';
            case 'medium':
            default:
                return 'w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg';
        }
    })();

    const effectiveIconSize =
        iconSize ?? (normalizedSize === 'small' ? 16 : normalizedSize === 'large' ? 24 : 20);
    const effectiveIconStroke = iconStroke ?? 1.5;

    const variantClasses = getButtonVariantClasses(variant, isActive, shouldTrackToggle, color);
    const toggleCustomClasses = isActive ? activeClassName : inactiveClassName;

    const accessibleTitle = title || ariaLabel;
    const accessibleAriaLabel = ariaLabel || title;

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={isDisabled}
            title={accessibleTitle}
            aria-label={accessibleAriaLabel}
            aria-pressed={shouldTrackToggle ? isActive : undefined}
            className={`inline-flex aspect-square shrink-0 p-0 ${BASE_BUTTON_CLASSES} ${sizeClasses} ${variantClasses} ${toggleCustomClasses} ${className}`.trim()}
            {...rest}
        >
            <EffectiveIcon
                size={effectiveIconSize}
                stroke={effectiveIconStroke}
                className={`shrink-0 ${loading ? 'animate-spin' : 'transition-transform active:scale-95'}`}
            />
        </button>
    );
};

export default IconButton;
