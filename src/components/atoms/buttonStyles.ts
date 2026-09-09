import { useState } from 'react';

export type ButtonVariant =
  | 'subtle'
  | 'primary'
  | 'solid'
  | 'secondary'
  | 'destructive'
  | 'destructive-subtle'
  | 'outline'
  | 'ghost';

export type ButtonSize = 'small' | 'medium' | 'large' | 'default';

export type ButtonWidth = 'auto' | 'fill' | 'full';

export interface BaseButtonSharedProps {
  /** Visual button style variant */
  variant?: ButtonVariant;
  /** Size tier ('default' aliases 'medium') */
  size?: ButtonSize;
  /** Controlled active toggle state */
  active?: boolean;
  /** Initial uncontrolled active state */
  defaultActive?: boolean;
  /** Whether the button behaves as an interactive toggle */
  isToggle?: boolean;
  /** Callback fired when toggle state flips */
  onToggle?: (active: boolean) => void;
  /** Legacy alias for onToggle */
  onChange?: (active: boolean) => void;
  /** Shows loading spinner and disables clicks */
  loading?: boolean;
  /** Extra CSS classes applied when active */
  activeClassName?: string;
  /** Extra CSS classes applied when inactive */
  inactiveClassName?: string;
  /** Accessible aria-label */
  ariaLabel?: string;
}

/**
 * Base classes shared across all buttons:
 * Focus rings, transitions, border, typography, and disabled states.
 */
export const BASE_BUTTON_CLASSES =
  'items-center justify-center border font-medium select-none transition-all duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Returns semantic color classes based on variant and active toggle state.
 */
export function getButtonVariantClasses(
  variant: ButtonVariant = 'subtle',
  isActive = false,
  shouldTrackToggle = false
): string {
  const normalizedVariant: ButtonVariant = variant === 'solid' ? 'primary' : variant;

  switch (normalizedVariant) {
    case 'primary':
      if (shouldTrackToggle) {
        return isActive
          ? 'bg-surface text-primary border-primary hover:bg-surface-hover hover:text-primary active:bg-surface-hover shadow-sm'
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
      return isActive
        ? 'bg-transparent text-primary border-primary hover:bg-surface-hover hover:text-primary active:bg-surface-hover'
        : 'bg-transparent text-foreground border-border hover:bg-surface-hover active:bg-surface-hover';

    case 'ghost':
      return isActive
        ? 'bg-transparent text-primary border-transparent hover:bg-surface-hover hover:text-primary active:bg-surface-hover'
        : 'bg-transparent text-foreground border-transparent hover:bg-surface-hover active:bg-surface-hover';

    case 'subtle':
    default:
      return isActive
        ? 'bg-surface text-primary border-primary/40 hover:bg-surface-hover hover:text-primary active:bg-surface-hover shadow-xs'
        : 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-foreground active:bg-surface-hover';
  }
}

/**
 * Shared hook to manage toggle state (controlled or uncontrolled).
 */
export function useButtonToggle({
  active: controlledActive,
  defaultActive = false,
  isToggle = false,
  onToggle,
  onChange,
}: {
  active?: boolean;
  defaultActive?: boolean;
  isToggle?: boolean;
  onToggle?: (active: boolean) => void;
  onChange?: (active: boolean) => void;
}) {
  const shouldTrackToggle =
    isToggle || defaultActive !== false || onToggle !== undefined || controlledActive !== undefined;
  const isControlled = controlledActive !== undefined;
  const [internalActive, setInternalActive] = useState<boolean>(defaultActive);

  const isActive = isControlled ? Boolean(controlledActive) : shouldTrackToggle ? internalActive : false;

  const handleToggleClick = () => {
    if (!shouldTrackToggle) return;
    const nextState = !isActive;
    if (!isControlled) {
      setInternalActive(nextState);
    }
    onToggle?.(nextState);
    onChange?.(nextState);
  };

  return {
    isActive,
    shouldTrackToggle,
    handleToggleClick,
  };
}
