import React from 'react';
import { IconCheck, IconBulb } from '@tabler/icons-react';
import type { InstructionStep } from '../../types/recipe';

export interface InstructionViewerItemProps {
    step: InstructionStep;
    isDone: boolean;
    onToggle: () => void;
}

export const InstructionViewerItem: React.FC<InstructionViewerItemProps> = ({
    step,
    isDone,
    onToggle
}) => {
    return (
        <div
            id={`instruction-step-${step.stepNumber}`}
            data-instruction-step={step.stepNumber}
            data-step-done={isDone}
            onClick={onToggle}
            role="checkbox"
            aria-checked={isDone}
            aria-label={`Step ${step.stepNumber}: ${step.instruction}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggle();
                }
            }}
            className={`scroll-mt-6 p-3 rounded-2xl bg-surface border transition-all cursor-pointer select-none space-y-3 ${isDone
                ? 'border-primary/40 bg-primary/5 opacity-80'
                : 'border-border hover:border-border/80 hover:bg-surface-hover/50'
                }`}
        >
            <div className="flex items-start gap-3">
                {/* Step number / check badge */}
                <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${isDone
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface-hover text-foreground border border-border'
                        }`}
                >
                    {isDone ? <IconCheck className="w-4 h-4" stroke={2.5} /> : step.stepNumber}
                </span>

                <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {step.instruction}
                    </p>
                </div>
            </div>

            {/* Chef Tip Callout */}
            {step.tip && (
                <div className="ml-10 flex items-start gap-2 p-2.5 rounded-xl bg-secondary/40 border border-secondary/60 text-secondary-foreground text-xs">
                    <IconBulb className="w-4 h-4 shrink-0 mt-0.5 text-primary" stroke={1.5} />
                    <div className="leading-snug">
                        <span className="font-semibold">Tip: </span>
                        <span>{step.tip}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
