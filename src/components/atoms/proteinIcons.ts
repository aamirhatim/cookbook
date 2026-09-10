import type { Icon } from '@tabler/icons-react';
import {
    IconFish,
    IconCanary,
    IconMeat,
    IconCube,
} from '@tabler/icons-react';
import type { ProteinType } from '../../types/recipe';

export const PROTEIN_ICON_MAP: Record<ProteinType, Icon> = {
    fish: IconFish,
    poultry: IconCanary,
    'red meat': IconMeat,
    tofu: IconCube,
};

export const PROTEIN_LABEL_MAP: Record<ProteinType, string> = {
    fish: 'Seafood',
    poultry: 'Poultry',
    'red meat': 'Red Meat',
    tofu: 'Tofu',
};
