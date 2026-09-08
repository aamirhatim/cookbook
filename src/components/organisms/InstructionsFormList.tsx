import React from 'react';
import { IconFolderPlus } from '@tabler/icons-react';
import type { InstructionSection } from '../../types/recipe';
import { InstructionSectionCard } from '../molecules/InstructionSectionCard';

export interface InstructionsFormListProps {
    instructions: InstructionSection[];
    onChange: (instructions: InstructionSection[]) => void;
}

export const InstructionsFormList: React.FC<InstructionsFormListProps> = ({
    instructions,
    onChange
}) => {
    // Reindex step numbers globally across all sections
    const reindexSections = (rawSections: InstructionSection[]): InstructionSection[] => {
        let currentNumber = 1;
        return rawSections.map((sec) => ({
            ...sec,
            steps: (sec.steps || []).map((step) => ({
                ...step,
                stepNumber: currentNumber++
            }))
        }));
    };

    const sections = instructions.length > 0 ? instructions : [{ title: '', steps: [] }];

    const updateSections = (newSections: InstructionSection[]) => {
        onChange(reindexSections(newSections));
    };

    const handleAddSection = () => {
        const next = [
            ...sections,
            { title: '', steps: [{ stepNumber: 0, instruction: '' }] }
        ];
        updateSections(next);
    };

    const handleRemoveSection = (sectionIndex: number) => {
        const next = sections.filter((_, idx) => idx !== sectionIndex);
        updateSections(next.length > 0 ? next : [{ title: '', steps: [] }]);
    };

    const handleMoveSection = (sectionIndex: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
        if (targetIndex < 0 || targetIndex >= sections.length) return;
        const next = [...sections];
        const [moved] = next.splice(sectionIndex, 1);
        next.splice(targetIndex, 0, moved);
        updateSections(next);
    };

    const handleChangeTitle = (sectionIndex: number, title: string) => {
        const next = [...sections];
        next[sectionIndex] = { ...next[sectionIndex], title };
        updateSections(next);
    };

    const handleAddStep = (sectionIndex: number) => {
        const next = [...sections];
        const currentSteps = next[sectionIndex].steps || [];
        next[sectionIndex] = {
            ...next[sectionIndex],
            steps: [...currentSteps, { stepNumber: 0, instruction: '' }]
        };
        updateSections(next);
    };

    const handleChangeStepInstruction = (
        sectionIndex: number,
        stepIndex: number,
        instruction: string
    ) => {
        const next = [...sections];
        const currentSteps = [...(next[sectionIndex].steps || [])];
        currentSteps[stepIndex] = { ...currentSteps[stepIndex], instruction };
        next[sectionIndex] = { ...next[sectionIndex], steps: currentSteps };
        updateSections(next);
    };

    const handleChangeStepTip = (
        sectionIndex: number,
        stepIndex: number,
        tip: string | undefined
    ) => {
        const next = [...sections];
        const currentSteps = [...(next[sectionIndex].steps || [])];
        if (tip !== undefined) {
            currentSteps[stepIndex] = { ...currentSteps[stepIndex], tip };
        } else {
            const { tip: _removed, ...rest } = currentSteps[stepIndex];
            currentSteps[stepIndex] = rest;
        }
        next[sectionIndex] = { ...next[sectionIndex], steps: currentSteps };
        updateSections(next);
    };

    const handleRemoveStep = (sectionIndex: number, stepIndex: number) => {
        const next = [...sections];
        const currentSteps = (next[sectionIndex].steps || []).filter((_, idx) => idx !== stepIndex);
        next[sectionIndex] = { ...next[sectionIndex], steps: currentSteps };
        updateSections(next);
    };

    const handleMoveStep = (
        sectionIndex: number,
        stepIndex: number,
        direction: 'up' | 'down'
    ) => {
        const next = sections.map((sec) => ({
            ...sec,
            steps: [...(sec.steps || [])]
        }));
        const currentSteps = next[sectionIndex].steps;
        const [movedStep] = currentSteps.splice(stepIndex, 1);
        if (!movedStep) return;

        if (direction === 'up') {
            if (stepIndex > 0) {
                currentSteps.splice(stepIndex - 1, 0, movedStep);
            } else if (sectionIndex > 0) {
                next[sectionIndex - 1].steps.push(movedStep);
            } else {
                currentSteps.unshift(movedStep);
                return;
            }
        } else {
            if (stepIndex < currentSteps.length) {
                currentSteps.splice(stepIndex + 1, 0, movedStep);
            } else if (sectionIndex < next.length - 1) {
                next[sectionIndex + 1].steps.unshift(movedStep);
            } else {
                currentSteps.push(movedStep);
                return;
            }
        }

        updateSections(next);
    };

    return (
        <div className="flex flex-col gap-4">
            {sections.map((section, idx) => (
                <InstructionSectionCard
                    key={idx}
                    section={section}
                    sectionIndex={idx}
                    totalSections={sections.length}
                    onChangeTitle={(title) => handleChangeTitle(idx, title)}
                    onAddStep={() => handleAddStep(idx)}
                    onChangeStepInstruction={(stepIdx, text) =>
                        handleChangeStepInstruction(idx, stepIdx, text)
                    }
                    onChangeStepTip={(stepIdx, tip) => handleChangeStepTip(idx, stepIdx, tip)}
                    onRemoveStep={(stepIdx) => handleRemoveStep(idx, stepIdx)}
                    onRemoveSection={() => handleRemoveSection(idx)}
                    onMoveUp={() => handleMoveSection(idx, 'up')}
                    onMoveDown={() => handleMoveSection(idx, 'down')}
                    onMoveStep={(stepIdx, direction) => handleMoveStep(idx, stepIdx, direction)}
                />
            ))}

            <button
                type="button"
                onClick={handleAddSection}
                className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors bg-surface"
            >
                <IconFolderPlus className="w-5 h-5" stroke={1.5} />
                <span>Add Instruction Section</span>
            </button>
        </div>
    );
};
