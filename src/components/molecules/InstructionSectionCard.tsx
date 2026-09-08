import React, { useState } from 'react';
import { IconPlus, IconTrash, IconArrowUp, IconArrowDown, IconChevronDown } from '@tabler/icons-react';
import type { InstructionSection } from '../../types/recipe';
import { Input } from '../atoms/Input';
import { ButtonIcon } from '../atoms/ButtonIcon';
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
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-3 p-3.5 sm:p-4 bg-surface-hover/60 rounded-2xl border border-border">
            {/* Section Header Controls */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder={totalSections > 1 ? 'Section Title (e.g. Prepare Dough, Bake)' : 'Section Title (optional)'}
                    className="flex-1 font-semibold text-sm h-9 bg-surface"
                    value={section.title || ''}
                    onChange={(e) => onChangeTitle(e.target.value)}
                />

                <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface/80 transition-colors shrink-0 flex items-center justify-center min-w-[32px] min-h-[32px]"
                    aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
                    title={isCollapsed ? 'Expand section' : 'Collapse section'}
                >
                    <IconChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                            isCollapsed ? '-rotate-90' : 'rotate-0'
                        }`}
                        stroke={2}
                    />
                </button>

                {totalSections > 1 && (
                    <div className="flex items-center gap-1 shrink-0">
                        {onMoveUp && (
                            <ButtonIcon
                                icon={IconArrowUp}
                                size="small"
                                onClick={onMoveUp}
                                disabled={sectionIndex === 0}
                                ariaLabel="Move section up"
                                title="Move section up"
                            />
                        )}
                        {onMoveDown && (
                            <ButtonIcon
                                icon={IconArrowDown}
                                size="small"
                                onClick={onMoveDown}
                                disabled={sectionIndex === totalSections - 1}
                                ariaLabel="Move section down"
                                title="Move section down"
                            />
                        )}
                        <ButtonIcon
                            icon={IconTrash}
                            size="small"
                            onClick={onRemoveSection}
                            ariaLabel="Remove section"
                            title="Remove section"
                            variant="destructive"
                        />
                    </div>
                )}
            </div>

            {/* Collapsible Content */}
            {isCollapsed ? (
                <div
                    onClick={() => setIsCollapsed(false)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsCollapsed(false);
                        }
                    }}
                    className="py-2 px-3 rounded-xl bg-surface/60 border border-dashed border-border text-xs text-muted-foreground flex items-center justify-between cursor-pointer hover:bg-surface transition-colors"
                >
                    <span>
                        {section.steps.length} {section.steps.length === 1 ? 'step' : 'steps'}
                        {section.steps.length > 0 &&
                            ` (Steps ${section.steps[0]?.stepNumber}–${section.steps[section.steps.length - 1]?.stepNumber})`}
                    </span>
                    <span className="font-semibold text-primary text-xs">Expand</span>
                </div>
            ) : (
                <>
                    {/* List of Steps */}
                    <div className="flex flex-col gap-2.5">
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

                        {section.steps.length === 0 && (
                            <div className="py-3 px-4 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
                                No steps in this section yet.
                            </div>
                        )}
                    </div>

                    {/* Add Step Button */}
                    <button
                        type="button"
                        onClick={onAddStep}
                        className="w-full py-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm"
                    >
                        <IconPlus className="w-4 h-4" stroke={2} />
                        <span>{section.title ? `Add Step to ${section.title}` : 'Add Step'}</span>
                    </button>
                </>
            )}
        </div>
    );
};
