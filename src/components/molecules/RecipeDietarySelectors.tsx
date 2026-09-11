import React from 'react';
import { IconCarrot } from '@tabler/icons-react';
import type { Difficulty, ProteinType } from '../../types/recipe';
import { IconButton } from '../atoms/IconButton';
import { FormField } from './FormField';
import { StepperInput } from './StepperInput';
import { DIFFICULTY_OPTIONS } from '../atoms/difficultyIcons';
import { PROTEIN_ICON_MAP, PROTEIN_LABEL_MAP } from '../atoms/proteinIcons';

export interface RecipeDietarySelectorsProps {
    servings?: number;
    onServingsChange: (servings: number) => void;
    difficulty?: Difficulty;
    onDifficultyChange: (diff: Difficulty) => void;
    isVeg?: boolean;
    onVegChange: (isVeg: boolean) => void;
    protein?: ProteinType[];
    onProteinChange: (protein: ProteinType[]) => void;
    disabled?: boolean;
}

const PROTEIN_KEYS: ProteinType[] = ['fish', 'poultry', 'red meat', 'tofu'];

export const RecipeDietarySelectors: React.FC<RecipeDietarySelectorsProps> = ({
    servings,
    onServingsChange,
    difficulty = 'medium',
    onDifficultyChange,
    isVeg = false,
    onVegChange,
    protein = [],
    onProteinChange,
    disabled = false,
}) => {
    const handleProteinToggle = (proteinItem: ProteinType) => {
        const next = protein.includes(proteinItem)
            ? protein.filter((p) => p !== proteinItem)
            : [...protein, proteinItem];
        onProteinChange(next);
    };

    return (
        <div className="flex items-start gap-3 sm:gap-4 flex-wrap">
            <FormField label="Servings" className="shrink-0">
                <StepperInput
                    value={servings}
                    onChange={onServingsChange}
                    min={1}
                    step={1}
                    fieldSize="compact"
                    placeholder="1"
                    ariaLabel="Servings"
                    disabled={disabled}
                />
            </FormField>

            <FormField label="Difficulty" className="shrink-0">
                <div
                    className="flex items-center gap-1.5 sm:gap-2 h-11"
                    role="radiogroup"
                    aria-label="Difficulty"
                >
                    {DIFFICULTY_OPTIONS.map((opt) => {
                        const isSelected = difficulty === opt.value;
                        return (
                            <IconButton
                                key={opt.value}
                                type="button"
                                role="radio"
                                icon={opt.icon}
                                active={isSelected}
                                onClick={() => onDifficultyChange(opt.value)}
                                title={opt.label}
                                ariaLabel={`${opt.label} difficulty`}
                                aria-checked={isSelected}
                                aria-pressed={isSelected}
                                variant="subtle"
                                iconSize={22}
                                iconStroke={1.5}
                                disabled={disabled}
                            />
                        );
                    })}
                </div>
            </FormField>

            <FormField label="Veg?" className="shrink-0">
                <div className="flex items-center h-11">
                    <IconButton
                        type="button"
                        icon={IconCarrot}
                        isToggle
                        active={isVeg}
                        onClick={() => onVegChange(!isVeg)}
                        title={isVeg ? 'Vegetarian (Active)' : 'Mark as Vegetarian'}
                        ariaLabel="Veg?"
                        variant="subtle"
                        iconSize={22}
                        iconStroke={1.5}
                        disabled={disabled}
                    />
                </div>
            </FormField>

            <FormField label="Proteins" className="shrink-0">
                <div
                    className="flex items-center gap-1.5 sm:gap-2 h-11"
                    role="group"
                    aria-label="Protein selection"
                >
                    {PROTEIN_KEYS.map((key) => {
                        const IconComponent = PROTEIN_ICON_MAP[key];
                        const label = PROTEIN_LABEL_MAP[key];
                        const isSelected = protein.includes(key);
                        return (
                            <IconButton
                                key={key}
                                type="button"
                                icon={IconComponent}
                                isToggle
                                active={isSelected}
                                onClick={() => handleProteinToggle(key)}
                                title={isSelected ? `${label} (Selected)` : label}
                                ariaLabel={label}
                                aria-pressed={isSelected}
                                variant="subtle"
                                iconSize={22}
                                iconStroke={1.5}
                                disabled={disabled}
                            />
                        );
                    })}
                </div>
            </FormField>
        </div>
    );
};
