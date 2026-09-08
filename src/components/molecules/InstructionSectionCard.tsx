import React from 'react';
import type { InstructionSection } from '../../types/recipe';
import { SectionCard } from './SectionCard';
import { InstructionFormItem } from './InstructionFormItem';

export interface InstructionSectionCardProps {
    section: InstructionSection;
    sectionIndex: number;
    totalSections: number;
    onChangeTitle: (title: string) => void;
    onAddStep: () => void;
    onChangeStepInstruction: (stepIndex: number, instruction: string) => void;
    onChangeStepTip: (stepIndex: number, tip: string | undefined) => void;
    onRemoveStep: (stepIndex: number) => void;
    onRemoveSection: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onMoveStep?: (stepIndex: number, direction: 'up' | 'down') => void;
}

export const InstructionSectionCard: React.FC<InstructionSectionCardProps> = ({
    section,
    sectionIndex,
    totalSections,
    onChangeTitle,
    onAddStep,
    onChangeStepInstruction,
    onChangeStepTip,
    onRemoveStep,
    onRemoveSection,
    onMoveUp,
    onMoveDown,
    onMoveStep
}) => {
    const stepCount = section.steps.length;
    const stepRange =
        stepCount > 0
            ? ` (Steps ${section.steps[0]?.stepNumber}–${section.steps[stepCount - 1]?.stepNumber})`
            : '';

    const collapsedSummary = (
        <span>
            {stepCount} {stepCount === 1 ? 'step' : 'steps'}
            {stepRange}
        </span>
    );

    return (
        <SectionCard
            title={section.title || ''}
            sectionIndex={sectionIndex}
            totalSections={totalSections}
            titlePlaceholder="Section Title (e.g. Prepare Dough, Bake)"
            itemCount={stepCount}
            collapsedSummaryText={collapsedSummary}
            emptyMessage="No steps in this section yet."
            addItemText={section.title ? `Add Step to ${section.title}` : 'Add Step'}
            onChangeTitle={onChangeTitle}
            onAddItem={onAddStep}
            onRemoveSection={onRemoveSection}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
        >
            {section.steps.map((step, stepIdx) => {
                const isFirst = sectionIndex === 0 && stepIdx === 0;
                const isLast =
                    sectionIndex === totalSections - 1 &&
                    stepIdx === section.steps.length - 1;

                return (
                    <InstructionFormItem
                        key={stepIdx}
                        step={step}
                        onChangeInstruction={(text) => onChangeStepInstruction(stepIdx, text)}
                        onChangeTip={(tip) => onChangeStepTip(stepIdx, tip)}
                        onRemove={() => onRemoveStep(stepIdx)}
                        onMoveUp={onMoveStep ? () => onMoveStep(stepIdx, 'up') : undefined}
                        onMoveDown={onMoveStep ? () => onMoveStep(stepIdx, 'down') : undefined}
                        isFirst={isFirst}
                        isLast={isLast}
                    />
                );
            })}
        </SectionCard>
    );
};
