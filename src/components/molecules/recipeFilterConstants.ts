import React from 'react';
import type { Difficulty, ProteinType } from '../../types/recipe';
import type { Icon, IconProps } from '@tabler/icons-react';
import {
    IconTimeDuration5,
    IconTimeDuration15,
    IconTimeDuration30,
    IconTimeDuration60,
    IconHexagonLetterE,
    IconHexagonLetterM,
    IconHexagonLetterH,
    IconCarrot,
    IconCanary,
    IconMeat,
    IconFish,
    IconCube,
} from '@tabler/icons-react';

export const TIME_OPTIONS = [
    { id: 'time-5', label: '< 5 min', value: '5' },
    { id: 'time-15', label: '< 15 min', value: '15' },
    { id: 'time-30', label: '< 30 min', value: '30' },
    { id: 'time-60', label: '< 1 hr', value: '60' },
];

export const TIME_ICON_MAP: Record<string, React.ComponentType<IconProps> | Icon> = {
    '5': IconTimeDuration5,
    '15': IconTimeDuration15,
    '30': IconTimeDuration30,
    '60': IconTimeDuration60,
};

export const DIFFICULTY_OPTIONS: { id: string; label: string; value: Difficulty }[] = [
    { id: 'diff-easy', label: 'Easy', value: 'easy' },
    { id: 'diff-med', label: 'Medium', value: 'medium' },
    { id: 'diff-hard', label: 'Hard', value: 'hard' },
];

export const DIFFICULTY_ICON_MAP: Record<Difficulty, React.ComponentType<IconProps> | Icon> = {
    easy: IconHexagonLetterE,
    medium: IconHexagonLetterM,
    hard: IconHexagonLetterH,
};

export type ProteinFilterValue = ProteinType | 'veg';

export interface ProteinFilterOption {
    id: string;
    value: ProteinFilterValue;
    label: string;
    shortLabel?: string;
    icon: React.ComponentType<IconProps> | Icon;
    description: string;
}

export const PROTEIN_FILTER_OPTIONS: ProteinFilterOption[] = [
    {
        id: 'protein-veg',
        value: 'veg',
        label: 'Vegetarian',
        shortLabel: 'Veg',
        icon: IconCarrot,
        description: 'Vegetarian',
    },
    {
        id: 'protein-poultry',
        value: 'poultry',
        label: 'Poultry',
        shortLabel: 'Poultry',
        icon: IconCanary,
        description: 'Poultry',
    },
    {
        id: 'protein-meat',
        value: 'red meat',
        label: 'Red Meat',
        shortLabel: 'Meat',
        icon: IconMeat,
        description: 'Red meat',
    },
    {
        id: 'protein-fish',
        value: 'fish',
        label: 'Seafood',
        shortLabel: 'Seafood',
        icon: IconFish,
        description: 'Seafood',
    },
    {
        id: 'protein-tofu',
        value: 'tofu',
        label: 'Tofu',
        shortLabel: 'Tofu',
        icon: IconCube,
        description: 'Tofu',
    },
];

export const PROTEIN_FILTER_ICON_MAP: Record<ProteinFilterValue, React.ComponentType<IconProps> | Icon> = {
    veg: IconCarrot,
    poultry: IconCanary,
    'red meat': IconMeat,
    fish: IconFish,
    tofu: IconCube,
};

