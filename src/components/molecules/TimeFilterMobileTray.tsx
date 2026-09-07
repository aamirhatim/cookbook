import React from 'react';
import type { Icon, IconProps } from '@tabler/icons-react';
import {
    IconTimeDuration5,
    IconTimeDuration15,
    IconTimeDuration30,
    IconTimeDuration60,
} from '@tabler/icons-react';
import { ButtonIcon } from '../atoms/ButtonIcon';

export interface TimeDurationOption {
    id: string;
    value: string;
    label: string;
    icon: React.ComponentType<IconProps> | Icon;
    description: string;
}

export const TIME_DURATION_OPTIONS: TimeDurationOption[] = [
    {
        id: 'time-5',
        value: '5',
        label: '5 min',
        icon: IconTimeDuration5,
        description: 'Under 5 minutes',
    },
    {
        id: 'time-15',
        value: '15',
        label: '15 min',
        icon: IconTimeDuration15,
        description: 'Under 15 minutes',
    },
    {
        id: 'time-30',
        value: '30',
        label: '30 min',
        icon: IconTimeDuration30,
        description: 'Under 30 minutes',
    },
    {
        id: 'time-60',
        value: '60',
        label: '1 hr',
        icon: IconTimeDuration60,
        description: 'Under 1 hour',
    },
];

export interface TimeFilterMobileTrayProps {
    selectedValue: string;
    onSelect: (value: string) => void;
    onClose?: () => void;
    className?: string;
}

export const TimeFilterMobileTray: React.FC<TimeFilterMobileTrayProps> = ({
    selectedValue,
    onSelect,
    className = '',
}) => {
    const handleItemClick = (val: string) => {
        // If the tapped option is already active, toggle it back to 'all'
        if (selectedValue === val) {
            onSelect('all');
        } else {
            onSelect(val);
        }
    };

    return (
        <div
            role="radiogroup"
            aria-label="Filter recipes by maximum preparation and cooking time"
            className={`w-full py-2 px-1 select-none ${className}`}
        >
            <div className="grid grid-cols-4 gap-2 sm:gap-4 items-center justify-items-center">
                {TIME_DURATION_OPTIONS.map((option) => {
                    const isSelected = selectedValue === option.value;
                    return (
                        <div
                            key={option.id}
                            className="flex items-center justify-center w-full cursor-pointer"
                            onClick={() => handleItemClick(option.value)}
                        >
                            <ButtonIcon
                                icon={option.icon}
                                active={isSelected}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleItemClick(option.value);
                                }}
                                title={option.description}
                                ariaLabel={option.description}
                                role="radio"
                                aria-checked={isSelected}
                                variant="subtle"
                                iconSize={35}
                                iconStroke={1}
                                className="w-full max-w-[68px] h-14 min-w-[50px] min-h-[50px] rounded-xl flex items-center justify-center transition-all active:scale-95"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
