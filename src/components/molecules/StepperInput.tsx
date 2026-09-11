import React from 'react';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { Input } from '../atoms/Input';
import { IconButton } from '../atoms/IconButton';

export type StepperFieldSize = 'compact' | 'medium' | 'large' | 'full' | 'sm' | 'md' | 'lg';

export interface StepperInputProps {
    value: number | undefined | null;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    fieldSize?: StepperFieldSize;
    disabled?: boolean;
    placeholder?: string;
    ariaLabel?: string;
    decreaseTitle?: string;
    increaseTitle?: string;
    className?: string;
    inputClassName?: string;
}

const FIELD_SIZE_CLASSES: Record<string, string> = {
    compact: 'w-14 sm:w-16',
    sm: 'w-14 sm:w-16',
    medium: 'w-20 sm:w-24',
    md: 'w-20 sm:w-24',
    large: 'w-28 sm:w-32',
    lg: 'w-28 sm:w-32',
    full: 'flex-1 min-w-0',
};

export const StepperInput: React.FC<StepperInputProps> = ({
    value,
    onChange,
    min = 0,
    max,
    step = 1,
    fieldSize = 'compact',
    disabled = false,
    placeholder,
    ariaLabel,
    decreaseTitle,
    increaseTitle,
    className = '',
    inputClassName = '',
}) => {
    const isMinusDisabled = disabled || (value !== undefined && value !== null ? value <= min : true);
    const isPlusDisabled = disabled || (max !== undefined && value !== undefined && value !== null ? value >= max : false);

    const handleStep = (delta: number, isFine: boolean = false) => {
        if (disabled) return;
        const current = value || 0;

        if (isFine || step === 1) {
            const next = current + delta;
            const clamped = Math.max(min, max !== undefined ? Math.min(max, next) : next);
            onChange(clamped);
            return;
        }

        let next: number;
        if (delta > 0) {
            next = Math.floor(current / step) * step + step;
        } else {
            next = Math.ceil(current / step) * step - step;
        }
        const clamped = Math.max(min, max !== undefined ? Math.min(max, next) : next);
        onChange(clamped);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseInt(e.target.value, 10);
        if (isNaN(parsed)) {
            onChange(min);
        } else {
            const clamped = Math.max(min, max !== undefined ? Math.min(max, parsed) : parsed);
            onChange(clamped);
        }
    };

    const labelSuffix = ariaLabel ? ariaLabel.toLowerCase() : 'value';
    const shiftTip = step > 1 ? ' (Shift+click for 1)' : '';
    const sizeClass = FIELD_SIZE_CLASSES[fieldSize] || FIELD_SIZE_CLASSES.compact;

    return (
        <div className={`flex items-center gap-1 sm:gap-1.5 h-11 ${className}`.trim()}>
            <IconButton
                type="button"
                icon={IconMinus}
                onClick={(e) => handleStep(-1, e.shiftKey)}
                disabled={isMinusDisabled}
                title={decreaseTitle || `Decrease ${labelSuffix}${shiftTip}`}
                ariaLabel={`Decrease ${labelSuffix}`}
                variant="outline"
                iconSize={18}
                iconStroke={2}
                className="shrink-0"
            />
            <Input
                type="number"
                min={min}
                max={max}
                placeholder={placeholder ?? String(min)}
                value={value || ''}
                onChange={handleInputChange}
                disabled={disabled}
                aria-label={ariaLabel}
                className={`${sizeClass} text-center px-1 font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${inputClassName}`.trim()}
            />
            <IconButton
                type="button"
                icon={IconPlus}
                onClick={(e) => handleStep(1, e.shiftKey)}
                disabled={isPlusDisabled}
                title={increaseTitle || `Increase ${labelSuffix}${shiftTip}`}
                ariaLabel={`Increase ${labelSuffix}`}
                variant="outline"
                iconSize={18}
                iconStroke={2}
                className="shrink-0"
            />
        </div>
    );
};
