import React, { useCallback } from 'react';
import { IconFolderPlus } from '@tabler/icons-react';
import type { InstructionSection, InstructionStep } from '../../types/recipe';
import { InstructionSectionCard } from '../molecules/InstructionSectionCard';
import { useSectionList } from '../../hooks/useSectionList';

export interface InstructionsFormListProps {
    instructions: InstructionSection[];
    onChange: (instructions: InstructionSection[]) => void;
}

export const InstructionsFormList: React.FC<InstructionsFormListProps> = ({
    instructions,
    onChange
}) => {
    // Reindex step numbers globally across all sections
    const handleSectionsChange = useCallback(
        (rawSections: InstructionSection[]) => {
            let currentNumber = 1;
            const reindexed = rawSections.map((sec) => ({
                ...sec,
                steps: (sec.steps || []).map((step) => ({
                    ...step,
                    stepNumber: currentNumber++
                }))
            }));
            onChange(reindexed);
        },
        [onChange]
    );

    const {
        sections,
        handleAddSection,
        handleRemoveSection,
        handleMoveSection,
        handleChangeTitle,
        handleAddItem,
        handleUpdateItem,
        handleRemoveItem,
        handleMoveItem,
    } = useSectionList<InstructionStep, InstructionSection>({
        sections: instructions,
        onChange: handleSectionsChange,
        getItems: (s) => s.steps || [],
        setItems: (s, steps) => ({ ...s, steps }),
        createEmptyItem: () => ({ stepNumber: 0, instruction: '' }),
        createEmptySection: () => ({
            title: '',
            steps: [{ stepNumber: 0, instruction: '' }]
        }),
    });

    const handleChangeInstruction = (
        secIdx: number,
        stepIdx: number,
        instruction: string
    ) => {
        const step = sections[secIdx].steps[stepIdx];
        if (!step) return;
        handleUpdateItem(secIdx, stepIdx, { ...step, instruction });
    };

    const handleChangeTip = (
        secIdx: number,
        stepIdx: number,
        tip: string | undefined
    ) => {
        const step = sections[secIdx].steps[stepIdx];
        if (!step) return;
        if (tip !== undefined) {
            handleUpdateItem(secIdx, stepIdx, { ...step, tip });
        } else {
            const { tip: _removed, ...rest } = step;
            handleUpdateItem(secIdx, stepIdx, rest as InstructionStep);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full min-w-0">
            {sections.map((section, idx) => (
                <InstructionSectionCard
                    key={idx}
                    section={section}
                    sectionIndex={idx}
                    totalSections={sections.length}
                    onChangeTitle={(title) => handleChangeTitle(idx, title)}
                    onAddStep={() => handleAddItem(idx)}
                    onChangeStepInstruction={(stepIdx, text) =>
                        handleChangeInstruction(idx, stepIdx, text)
                    }
                    onChangeStepTip={(stepIdx, tip) => handleChangeTip(idx, stepIdx, tip)}
                    onRemoveStep={(stepIdx) => handleRemoveItem(idx, stepIdx)}
                    onRemoveSection={() => handleRemoveSection(idx)}
                    onMoveUp={() => handleMoveSection(idx, 'up')}
                    onMoveDown={() => handleMoveSection(idx, 'down')}
                    onMoveStep={(stepIdx, direction) => handleMoveItem(idx, stepIdx, direction)}
                />
            ))}

            <button
                type="button"
                onClick={handleAddSection}
                className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <IconFolderPlus className="w-5 h-5" stroke={1.5} />
                <span>Add Instruction Section</span>
            </button>
        </div>
    );
};
