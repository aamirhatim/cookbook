import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IconCheck, type Icon, type IconProps } from '@tabler/icons-react';
import { ButtonIcon, type ButtonIconProps, type ButtonIconVariant } from './ButtonIcon';

export interface ConfirmationButtonProps extends Omit<ButtonIconProps, 'onConfirm'> {
  /** Callback triggered when the confirmation step is successfully completed (second click) */
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Optional callback invoked on the first click when entering confirmation mode */
  onConfirmStart?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Optional callback invoked if confirmation times out or is cancelled */
  onConfirmCancel?: () => void;
  /** Icon to display during confirmation state. Defaults to IconCheck */
  confirmIcon?: React.ComponentType<IconProps> | Icon;
  /** Variant to apply during confirmation state. Defaults to 'destructive' if base variant is destructive, otherwise 'primary' */
  confirmVariant?: ButtonIconVariant;
  /** Title / tooltip during confirmation state */
  confirmTitle?: string;
  /** Accessible aria-label during confirmation state */
  confirmAriaLabel?: string;
  /** Text to display during confirmation state (for buttons with text) */
  confirmText?: React.ReactNode;
  /** Additional classes applied during confirmation state */
  confirmClassName?: string;
  /** Duration in milliseconds before confirmation resets back to initial state. Defaults to 4000 */
  confirmTimeoutMs?: number;
  /** If true, stops event propagation on click (useful in clickable list rows or cards) */
  stopPropagation?: boolean;
}

export const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({
  icon,
  confirmIcon = IconCheck,
  variant = 'subtle',
  confirmVariant,
  title,
  confirmTitle,
  ariaLabel,
  confirmAriaLabel,
  text,
  confirmText,
  className = '',
  confirmClassName,
  confirmTimeoutMs = 4000,
  stopPropagation = false,
  disabled = false,
  loading = false,
  onClick,
  onKeyDown,
  onConfirm,
  onConfirmStart,
  onConfirmCancel,
  ...rest
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const cancelConfirmation = useCallback(() => {
    clearTimer();
    setIsConfirming(false);
    onConfirmCancel?.();
  }, [clearTimer, onConfirmCancel]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Cancel confirmation if button becomes disabled or is in loading state
  useEffect(() => {
    if (disabled || loading) {
      cancelConfirmation();
    }
  }, [disabled, loading, cancelConfirmation]);

  const isDestructive = variant === 'destructive' || variant === 'destructive-subtle';
  const effectiveConfirmVariant = confirmVariant ?? (isDestructive ? 'destructive' : 'primary');
  const effectiveConfirmClassName = confirmClassName ?? (isDestructive ? 'animate-pulse ring-2 ring-destructive/40' : 'animate-pulse ring-2 ring-primary/40');

  const activeIcon = isConfirming ? confirmIcon : icon;
  const activeVariant = isConfirming ? effectiveConfirmVariant : variant;
  const activeTitle = isConfirming
    ? (confirmTitle ?? (title ? `Click again to confirm: ${title}` : 'Click again to confirm'))
    : title;
  const activeAriaLabel = isConfirming
    ? (confirmAriaLabel ?? (ariaLabel ? `Confirm ${ariaLabel}` : activeTitle))
    : ariaLabel;
  const activeText = isConfirming && confirmText !== undefined ? confirmText : text;
  const mergedClassName = `${className} ${isConfirming ? effectiveConfirmClassName : ''}`.trim();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      e.stopPropagation();
    }

    if (disabled || loading) return;

    if (isConfirming) {
      clearTimer();
      setIsConfirming(false);
      onConfirm(e);
    } else {
      setIsConfirming(true);
      onConfirmStart?.(e);
      clearTimer();
      resetTimerRef.current = setTimeout(() => {
        setIsConfirming(false);
        resetTimerRef.current = null;
        onConfirmCancel?.();
      }, confirmTimeoutMs);
    }

    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (isConfirming && e.key === 'Escape') {
      e.stopPropagation();
      cancelConfirmation();
    }
    onKeyDown?.(e);
  };

  return (
    <ButtonIcon
      icon={activeIcon}
      variant={activeVariant}
      title={activeTitle}
      ariaLabel={activeAriaLabel}
      text={activeText}
      className={mergedClassName}
      disabled={disabled}
      loading={loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-confirming={isConfirming || undefined}
      {...rest}
    />
  );
};

export default ConfirmationButton;
