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

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'accent'
  | 'muted'
  | 'favorite'
  | 'favorites';

export type ButtonSize = 'small' | 'medium' | 'large' | 'default';

export type ButtonWidth = 'auto' | 'fill' | 'full';

export interface BaseButtonSharedProps {
  /** Visual button style variant */
  variant?: ButtonVariant;
  /** Semantic color theme override */
  color?: ButtonColor;
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
 * Returns semantic color classes based on variant, active toggle state, and color theme.
 */
export function getButtonVariantClasses(
  variant: ButtonVariant = 'subtle',
  isActive = false,
  shouldTrackToggle = false,
  color?: ButtonColor
): string {
  // Infer base style treatment and default color from variant
  let baseVariant: 'solid' | 'subtle' | 'outline' | 'ghost' = 'subtle';
  let resolvedColor: ButtonColor | undefined = color;

  if (variant === 'destructive') {
    baseVariant = 'solid';
    resolvedColor = color ?? 'destructive';
  } else if (variant === 'destructive-subtle') {
    baseVariant = 'subtle';
    resolvedColor = color ?? 'destructive';
  } else if (variant === 'solid' || variant === 'primary') {
    baseVariant = 'solid';
    resolvedColor = color ?? 'primary';
  } else if (variant === 'secondary') {
    baseVariant = 'solid';
    resolvedColor = color ?? 'secondary';
  } else if (variant === 'outline') {
    baseVariant = 'outline';
  } else if (variant === 'ghost') {
    baseVariant = 'ghost';
  } else {
    baseVariant = 'subtle';
  }

  const normalizedColor = resolvedColor === 'favorites' ? 'favorite' : resolvedColor;

  // 1. SOLID / FILLED
  if (baseVariant === 'solid') {
    if (shouldTrackToggle) {
      if (isActive) {
        switch (normalizedColor) {
          case 'favorite':
            return 'bg-surface text-favorite border-favorite hover:bg-surface-hover hover:text-favorite active:bg-surface-hover shadow-sm focus:ring-favorite/30';
          case 'destructive':
            return 'bg-surface text-destructive border-destructive hover:bg-surface-hover hover:text-destructive active:bg-surface-hover shadow-sm focus:ring-destructive/30';
          case 'accent':
            return 'bg-surface text-accent border-accent hover:bg-surface-hover hover:text-accent active:bg-surface-hover shadow-sm focus:ring-accent/30';
          case 'secondary':
            return 'bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90 shadow-sm active:bg-secondary/80';
          case 'muted':
            return 'bg-muted text-foreground border-border hover:bg-muted/80 shadow-sm active:bg-muted/70';
          case 'primary':
          default:
            return 'bg-surface text-primary border-primary hover:bg-surface-hover hover:text-primary active:bg-surface-hover shadow-sm';
        }
      }
      return 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-foreground active:bg-surface-hover';
    }

    switch (normalizedColor) {
      case 'favorite':
        return 'bg-favorite text-favorite-foreground border-transparent hover:bg-favorite/90 shadow-xs active:bg-favorite/80';
      case 'destructive':
        return 'bg-destructive text-destructive-foreground border-transparent hover:bg-destructive/90 shadow-xs active:bg-destructive/80';
      case 'accent':
        return 'bg-accent text-accent-foreground border-transparent hover:bg-accent/90 shadow-xs active:bg-accent/80';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80 shadow-xs active:bg-secondary/70';
      case 'muted':
        return 'bg-muted text-foreground border-transparent hover:bg-muted/80 shadow-xs active:bg-muted/70';
      case 'primary':
      default:
        return 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-sm active:bg-primary/80';
    }
  }

  // 2. SUBTLE
  if (baseVariant === 'subtle') {
    if (shouldTrackToggle) {
      if (isActive) {
        switch (normalizedColor) {
          case 'favorite':
            return 'bg-surface text-favorite border-favorite/40 hover:bg-surface-hover hover:text-favorite active:bg-surface-hover shadow-xs focus:ring-favorite/30';
          case 'destructive':
            return 'bg-surface text-destructive border-destructive/40 hover:bg-surface-hover hover:text-destructive active:bg-surface-hover shadow-xs focus:ring-destructive/30';
          case 'accent':
            return 'bg-surface text-accent border-accent/40 hover:bg-surface-hover hover:text-accent active:bg-surface-hover shadow-xs focus:ring-accent/30';
          case 'secondary':
            return 'bg-secondary/50 text-secondary-foreground border-secondary/60 hover:bg-secondary/70 active:bg-secondary/80 shadow-xs';
          case 'muted':
            return 'bg-surface text-muted-foreground border-border hover:bg-surface-hover active:bg-surface-hover shadow-xs';
          case 'primary':
          default:
            return 'bg-surface text-primary border-primary/40 hover:bg-surface-hover hover:text-primary active:bg-surface-hover shadow-xs';
        }
      }
      switch (normalizedColor) {
        case 'favorite':
          return 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-favorite hover:border-favorite/20 active:bg-surface-hover focus:ring-favorite/20';
        case 'destructive':
          return 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-destructive hover:border-destructive/20 active:bg-surface-hover focus:ring-destructive/20';
        case 'accent':
          return 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-accent hover:border-accent/20 active:bg-surface-hover focus:ring-accent/20';
        case 'secondary':
          return 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-secondary-foreground active:bg-surface-hover';
        default:
          return 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-foreground active:bg-surface-hover';
      }
    }

    // Non-toggle subtle: if a color is provided, gives the soft tinted "destructive-subtle" treatment for that color
    switch (normalizedColor) {
      case 'favorite':
        return 'bg-favorite/10 text-favorite border-favorite/30 hover:bg-favorite/15 active:bg-favorite/20';
      case 'destructive':
        return 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/15 active:bg-destructive/20';
      case 'accent':
        return 'bg-accent/10 text-accent border-accent/30 hover:bg-accent/15 active:bg-accent/20';
      case 'primary':
        return 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/15 active:bg-primary/20';
      case 'secondary':
        return 'bg-secondary/40 text-secondary-foreground border-secondary/60 hover:bg-secondary/60 active:bg-secondary/70';
      case 'muted':
        return 'bg-muted text-muted-foreground border-border hover:bg-muted/80 active:bg-muted/70';
      default:
        return 'bg-surface text-muted-foreground border-border hover:bg-surface-hover hover:text-foreground active:bg-surface-hover';
    }
  }

  // 3. OUTLINE
  if (baseVariant === 'outline') {
    if (shouldTrackToggle) {
      if (isActive) {
        switch (normalizedColor) {
          case 'favorite':
            return 'bg-transparent text-favorite border-favorite hover:bg-surface-hover hover:text-favorite active:bg-surface-hover';
          case 'destructive':
            return 'bg-transparent text-destructive border-destructive hover:bg-surface-hover hover:text-destructive active:bg-surface-hover';
          case 'accent':
            return 'bg-transparent text-accent border-accent hover:bg-surface-hover hover:text-accent active:bg-surface-hover';
          case 'primary':
          default:
            return 'bg-transparent text-primary border-primary hover:bg-surface-hover hover:text-primary active:bg-surface-hover';
        }
      }
      switch (normalizedColor) {
        case 'favorite':
          return 'bg-transparent text-foreground border-border hover:bg-surface-hover hover:text-favorite hover:border-favorite/30 active:bg-surface-hover';
        case 'destructive':
          return 'bg-transparent text-foreground border-border hover:bg-surface-hover hover:text-destructive hover:border-destructive/30 active:bg-surface-hover';
        case 'accent':
          return 'bg-transparent text-foreground border-border hover:bg-surface-hover hover:text-accent hover:border-accent/30 active:bg-surface-hover';
        default:
          return 'bg-transparent text-foreground border-border hover:bg-surface-hover active:bg-surface-hover';
      }
    }

    switch (normalizedColor) {
      case 'favorite':
        return 'bg-transparent text-favorite border-favorite hover:bg-favorite/10 active:bg-favorite/15';
      case 'destructive':
        return 'bg-transparent text-destructive border-destructive hover:bg-destructive/10 active:bg-destructive/15';
      case 'accent':
        return 'bg-transparent text-accent border-accent hover:bg-accent/10 active:bg-accent/15';
      case 'secondary':
        return 'bg-transparent text-secondary-foreground border-secondary hover:bg-secondary/40 active:bg-secondary/50';
      case 'muted':
        return 'bg-transparent text-muted-foreground border-border hover:bg-muted/40 active:bg-muted/60';
      case 'primary':
      default:
        return 'bg-transparent text-foreground border-border hover:bg-surface-hover active:bg-surface-hover';
    }
  }

  // 4. GHOST
  if (shouldTrackToggle) {
    if (isActive) {
      switch (normalizedColor) {
        case 'favorite':
          return 'bg-transparent text-favorite border-transparent hover:bg-surface-hover hover:text-favorite active:bg-surface-hover';
        case 'destructive':
          return 'bg-transparent text-destructive border-transparent hover:bg-surface-hover hover:text-destructive active:bg-surface-hover';
        case 'accent':
          return 'bg-transparent text-accent border-transparent hover:bg-surface-hover hover:text-accent active:bg-surface-hover';
        case 'primary':
        default:
          return 'bg-transparent text-primary border-transparent hover:bg-surface-hover hover:text-primary active:bg-surface-hover';
      }
    }
    switch (normalizedColor) {
      case 'favorite':
        return 'bg-transparent text-foreground border-transparent hover:bg-surface-hover hover:text-favorite active:bg-surface-hover';
      case 'destructive':
        return 'bg-transparent text-foreground border-transparent hover:bg-surface-hover hover:text-destructive active:bg-surface-hover';
      case 'accent':
        return 'bg-transparent text-foreground border-transparent hover:bg-surface-hover hover:text-accent active:bg-surface-hover';
      default:
        return 'bg-transparent text-foreground border-transparent hover:bg-surface-hover active:bg-surface-hover';
    }
  }

  switch (normalizedColor) {
    case 'favorite':
      return 'bg-transparent text-favorite border-transparent hover:bg-favorite/10 active:bg-favorite/15';
    case 'destructive':
      return 'bg-transparent text-destructive border-transparent hover:bg-destructive/10 active:bg-destructive/15';
    case 'accent':
      return 'bg-transparent text-accent border-transparent hover:bg-accent/10 active:bg-accent/15';
    case 'secondary':
      return 'bg-transparent text-secondary-foreground border-transparent hover:bg-secondary/40 active:bg-secondary/50';
    case 'muted':
      return 'bg-transparent text-muted-foreground border-transparent hover:bg-muted/40 active:bg-muted/60';
    case 'primary':
    default:
      return 'bg-transparent text-foreground border-transparent hover:bg-surface-hover active:bg-surface-hover';
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
