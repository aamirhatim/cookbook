import { IconButton } from '../atoms/IconButton';
import type { Difficulty } from '../../types/recipe';
import { DIFFICULTY_OPTIONS, type DifficultyOption } from '../atoms/difficultyIcons';

export type { DifficultyOption };
export { DIFFICULTY_OPTIONS };

export interface DifficultyFilterMobileTrayProps {
    selectedValues: Difficulty[] | string[];
    onSelect: (value: string) => void;
    onClose?: () => void;
    className?: string;
}

export const DifficultyFilterMobileTray: React.FC<DifficultyFilterMobileTrayProps> = ({
    selectedValues,
    onSelect,
    className = '',
}) => {
    const isSelected = (val: string) =>
        Array.isArray(selectedValues) ? selectedValues.includes(val as Difficulty) : selectedValues === val;

    return (
        <div
            role="group"
            aria-label="Filter recipes by difficulty"
            className={`w-full py-2 px-1 select-none ${className}`}
        >
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center justify-items-center max-w-[320px] mx-auto">
                {DIFFICULTY_OPTIONS.map((option) => {
                    const active = isSelected(option.value);
                    return (
                        <div
                            key={option.id}
                            className="flex flex-col items-center gap-1.5 w-full cursor-pointer"
                            onClick={() => onSelect(option.value)}
                        >
                            <IconButton
                                icon={option.icon}
                                active={active}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(option.value);
                                }}
                                title={option.description}
                                ariaLabel={option.description}
                                aria-pressed={active}
                                variant="subtle"
                                iconSize={35}
                                iconStroke={1}
                                className="w-full max-w-[68px] h-14 min-w-[50px] min-h-[50px] rounded-xl flex items-center justify-center transition-all active:scale-95"
                            />
                            <span
                                className={`text-xs transition-colors text-center ${
                                    active ? 'text-primary font-semibold' : 'text-muted-foreground font-medium'
                                }`}
                            >
                                {option.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
