import React from 'react';
import type { Icon, IconProps } from '@tabler/icons-react';

export type ChipColor =
    | 'default'
    | 'muted'
    | (string & {});

export type ChipSize = 'sm' | 'md';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Required text label */
    text: string;
    /** Optional icon displayed before the text */
    icon?: React.ComponentType<IconProps> | Icon | React.ReactNode;
    /**
     * Foreground color theme or CSS color (applied to text and border).
     * Accepts theme token names (e.g. 'purple', 'primary', 'muted') or any valid CSS color.
     * Defaults to bland monochrome ('muted-foreground') if omitted.
     */
    color?: ChipColor;
    /**
     * Background color theme, CSS color, or opacity syntax (applied to chip background).
     * Accepts theme token names (e.g. 'muted', 'surface', 'purple'), opacity variants (e.g. 'muted/85', 'purple/15'),
     * or any valid CSS color. Defaults to 'muted/85' when color is set, or 'muted' for bland default.
     */
    bgColor?: string;
    /** Whether to show a border around the chip. Defaults to false. */
    border?: boolean;
    /** Size tier ('sm' is default compact size) */
    size?: ChipSize;
    /** Automatically capitalize the text */
    capitalize?: boolean;
}

/**
 * Resolves a foreground color name or value to a CSS string.
 */
function resolveColor(value?: string): string {
    if (!value || value === 'default' || value === 'muted') {
        return 'var(--muted-foreground)';
    }
    if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') || value.startsWith('var(')) {
        return value;
    }
    return `var(--${value}-fg, var(--${value}, ${value}))`;
}

/**
 * Resolves a token identifier to a CSS variable or raw color.
 */
function resolveToken(token: string): string {
    if (token.startsWith('#') || token.startsWith('rgb') || token.startsWith('hsl') || token.startsWith('var(')) {
        return token;
    }
    return `var(--${token}, ${token})`;
}

/**
 * Resolves background color supporting token/opacity (e.g. 'muted/85'), CSS colors, and theme tokens.
 */
function resolveBgColor(value: string | undefined, defaultBg: string): string {
    if (!value || value === 'default') {
        return defaultBg;
    }
    const clean = value.startsWith('bg-') ? value.slice(3) : value;
    if (clean.includes('/')) {
        const [token, opacity] = clean.split('/');
        const parsed = Number(opacity);
        if (!isNaN(parsed)) {
            const base = resolveToken(token);
            return `color-mix(in srgb, ${base} ${parsed}%, transparent)`;
        }
    }
    return resolveToken(clean);
}

export const Chip: React.FC<ChipProps> = ({
    text,
    icon,
    color,
    bgColor,
    border = false,
    size = 'sm',
    capitalize = false,
    className = '',
    style,
    ...rest
}) => {
    const sizeClasses = size === 'md' ? 'text-sm px-3 py-1 gap-2' : 'text-xs px-2.5 py-0.5 gap-1.5';

    const isDefaultColor = !color || color === 'default';
    const foregroundColor = resolveColor(color);
    const borderColor = isDefaultColor
        ? 'var(--border)'
        : `color-mix(in srgb, ${foregroundColor} 85%, transparent)`;
    const defaultBg = isDefaultColor
        ? 'var(--muted)'
        : 'color-mix(in srgb, var(--muted) 85%, transparent)';
    const resolvedBackground = resolveBgColor(bgColor, defaultBg);

    const computedStyle: React.CSSProperties = {
        color: foregroundColor,
        backgroundColor: resolvedBackground,
        ...(border && borderColor ? { borderColor } : {}),
        ...style,
    };

    const renderIcon = () => {
        if (!icon) return null;

        if (React.isValidElement(icon)) {
            return icon;
        }

        const IconComponent = icon as React.ComponentType<IconProps>;
        return (
            <IconComponent
                className={size === 'md' ? 'w-4 h-4 shrink-0' : 'w-3.5 h-3.5 shrink-0'}
                stroke={1.5}
                aria-hidden="true"
            />
        );
    };

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium select-none transition-colors ${sizeClasses} ${border ? 'border' : ''} ${capitalize ? 'capitalize' : ''} ${className}`}
            style={computedStyle}
            {...rest}
        >
            {renderIcon()}
            <span>{text}</span>
        </span>
    );
};
