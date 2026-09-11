import type { Icon, IconProps } from '@tabler/icons-react';
import { IconButton } from '../atoms/IconButton';
import { TIME_OPTIONS, TIME_ICON_MAP } from './recipeFilterConstants';

export interface TimeDurationOption {
    id: string;
    value: string;
    label: string;
    icon: React.ComponentType<IconProps> | Icon;
    description: string;
}

export const TIME_DURATION_OPTIONS: TimeDurationOption[] = TIME_OPTIONS.map((opt) => ({
    id: opt.id,
    value: opt.value,
    label: opt.value === '60' ? '1 hr' : `${opt.value} min`,
    icon: TIME_ICON_MAP[opt.value],
    description: opt.value === '60' ? 'Under 1 hour' : `Under ${opt.value} minutes`,
}));

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
                            <IconButton
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
