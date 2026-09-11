import React, { useState, useEffect, useRef } from 'react';
import { FormField } from './FormField';
import { Input } from '../atoms/Input';

export interface CommaDelimitedInputProps {
    label: string;
    helperText?: string;
    placeholder?: string;
    values?: string[];
    onChange: (values: string[]) => void;
    disabled?: boolean;
    className?: string;
}

export const CommaDelimitedInput: React.FC<CommaDelimitedInputProps> = ({
    label,
    helperText,
    placeholder,
    values = [],
    onChange,
    disabled = false,
    className = '',
}) => {
    const [inputValue, setInputValue] = useState(() => values.join(', '));
    const lastEmittedRef = useRef<string>(JSON.stringify(values));

    useEffect(() => {
        const serialized = JSON.stringify(values);
        if (serialized !== lastEmittedRef.current) {
            lastEmittedRef.current = serialized;
            setInputValue(values.join(', '));
        }
    }, [values]);

    const handleChange = (val: string) => {
        setInputValue(val);
        const parsedArray = val
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        lastEmittedRef.current = JSON.stringify(parsedArray);
        onChange(parsedArray);
    };

    const handleBlur = () => {
        setInputValue(values.join(', '));
    };

    return (
        <FormField label={label} helperText={helperText} className={className}>
            <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                disabled={disabled}
            />
        </FormField>
    );
};
