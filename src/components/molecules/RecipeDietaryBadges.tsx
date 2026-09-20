import React from 'react';
import { IconCarrot, IconWorldMap } from '@tabler/icons-react';
import type { ProteinType } from '../../types/recipe';
import { Chip } from '../atoms/Chip';
import { PROTEIN_ICON_MAP, PROTEIN_LABEL_MAP } from '../atoms/proteinIcons';

export interface RecipeDietaryBadgesProps {
    cuisine?: string;
    isVeg?: boolean;
    protein?: ProteinType[];
    tags?: string[];
    className?: string;
}

export const RecipeDietaryBadges: React.FC<RecipeDietaryBadgesProps> = ({
    cuisine,
    isVeg,
    protein = [],
    tags = [],
    className = '',
}) => {
    const proteinList = protein.filter((p): p is ProteinType => Boolean(PROTEIN_ICON_MAP[p]));
    const hasBadges = cuisine || isVeg || proteinList.length > 0 || tags.length > 0;

    if (!hasBadges) return null;

    return (
        <div className={`flex flex-wrap items-center gap-1.5 pt-1 ${className}`.trim()}>
            {/* 1. Cuisine */}
            {cuisine && (
                <Chip
                    icon={IconWorldMap}
                    text={cuisine}
                    color="purple"
                    bgColor="purple-bg"
                    capitalize
                />
            )}

            {/* 2. Veg & Proteins */}
            {isVeg && (
                <Chip
                    icon={IconCarrot}
                    text="Vegetarian"
                    color="green-fg"
                    bgColor="green-bg"
                />
            )}
            {proteinList.map((p) => {
                const ProteinIcon = PROTEIN_ICON_MAP[p];
                return (
                    <Chip
                        key={p}
                        icon={ProteinIcon}
                        text={PROTEIN_LABEL_MAP[p]}
                        color="blue-fg"
                        bgColor="blue-bg"
                    />
                );
            })}

            {/* 3. Tags */}
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-hover text-muted-foreground border border-border/60"
                >
                    #{tag}
                </span>
            ))}
        </div>
    );
};
