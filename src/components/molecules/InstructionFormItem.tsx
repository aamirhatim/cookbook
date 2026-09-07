import React from 'react';
import type { InstructionStep } from '../../types/recipe';
import { Textarea } from '../atoms/Textarea';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { IconTrash, IconBulb } from '@tabler/icons-react';

export interface InstructionFormItemProps {
    step: InstructionStep;
    onChangeInstruction: (instruction: string) => void;
    onChangeTip: (tip: string | undefined) => void;
    onRemove: () => void;
}

export const InstructionFormItem: React.FC<InstructionFormItemProps> = ({
    step,
    onChangeInstruction,
    onChangeTip,
    onRemove
}) => {
    return (
        <div className="flex flex-col gap-3 p-3.5 bg-surface rounded-xl border border-border/70 relative">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Step {step.stepNumber}
                </span>
                <ButtonIcon
                    icon={IconTrash}
                    size="small"
                    onClick={onRemove}
                    ariaLabel="Remove step"
                    title="Remove step"
                />
            </div>

            <Textarea
                placeholder="Describe this step in detail..."
                value={step.instruction}
                onChange={(e) => onChangeInstruction(e.target.value)}
                className="min-h-[85px]"
            />

            {step.tip !== undefined ? (
                <div className="flex gap-2 items-start mt-0.5 relative">
                    <div className="pt-2 text-primary">
                        <IconBulb className="w-5 h-5" stroke={1.5} />
                    </div>
                    <Textarea
                        placeholder="Add a helpful chef tip for this step..."
                        value={step.tip}
                        onChange={(e) => onChangeTip(e.target.value)}
                        className="min-h-[55px] text-sm flex-1 bg-surface-hover/50"
                    />
                    <ButtonIcon
                        icon={IconTrash}
                        size="small"
                        onClick={() => onChangeTip(undefined)}
                        ariaLabel="Remove tip"
                        title="Remove tip"
                        className="absolute top-2 right-2"
                    />
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => onChangeTip('')}
                    className="self-start text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1.5"
                >
                    <IconBulb className="w-4 h-4" stroke={1.5} />
                    <span>Add Chef Tip</span>
                </button>
            )}
        </div>
    );
};
