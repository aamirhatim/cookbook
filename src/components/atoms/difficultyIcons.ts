import type { Icon } from '@tabler/icons-react';
import {
    IconHexagonLetterE,
    IconHexagonLetterM,
    IconHexagonLetterH,
} from '@tabler/icons-react';
import type { Difficulty } from '../../types/recipe';

export interface DifficultyOption {
    id: string;
    value: Difficulty;
    label: string;
    icon: Icon;
    description: string;
}

export const DIFFICULTY_ICON_MAP: Record<Difficulty, Icon> = {
    easy: IconHexagonLetterE,
    medium: IconHexagonLetterM,
    hard: IconHexagonLetterH,
};

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
    {
        id: 'diff-easy',
        value: 'easy',
        label: 'Easy',
        icon: IconHexagonLetterE,
        description: 'Easy difficulty',
    },
    {
        id: 'diff-med',
        value: 'medium',
        label: 'Medium',
        icon: IconHexagonLetterM,
        description: 'Medium difficulty',
    },
    {
        id: 'diff-hard',
        value: 'hard',
        label: 'Hard',
        icon: IconHexagonLetterH,
        description: 'Hard difficulty',
    },
];
