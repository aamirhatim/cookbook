import React, { useState } from 'react';
import { IconCheck, IconRotate2, IconListCheck, IconBulb } from '@tabler/icons-react';
import type { InstructionStep } from '../../types/recipe';

export interface RecipeViewerInstructionsProps {
    instructions: InstructionStep[];
    className?: string;
}

export const RecipeViewerInstructions: React.FC<RecipeViewerInstructionsProps> = ({
    instructions,
    className = '',
}) => {
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    const toggleStep = (stepNumber: number) => {
        setCompletedSteps((prev) => {
            const next = new Set(prev);
            if (next.has(stepNumber)) {
                next.delete(stepNumber);
            } else {
                next.add(stepNumber);
            }
            return next;
        });
    };

    const handleReset = () => {
        setCompletedSteps(new Set());
    };

    if (!instructions || instructions.length === 0) {
        return (
            <div className={`p-4 rounded-xl bg-surface border border-border text-center text-xs text-muted-foreground ${className}`}>
                No instruction steps listed for this recipe.
            </div>
        );
    }

    // Sort instructions by stepNumber
    const sortedSteps = [...instructions].sort((a, b) => a.stepNumber - b.stepNumber);

    return (
        <section className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IconListCheck className="w-5 h-5 text-primary" stroke={1.5} />
                    <h2 className="text-lg font-bold text-foreground">Instructions</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted-foreground font-medium">
                        {instructions.length} steps
                    </span>
                </div>

                {completedSteps.size > 0 && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        title="Reset completed steps"
                    >
                        <IconRotate2 className="w-3.5 h-3.5" stroke={1.5} />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {sortedSteps.map((step) => {
                    const isDone = completedSteps.has(step.stepNumber);
                    return (
                        <div
                            key={step.stepNumber}
                            onClick={() => toggleStep(step.stepNumber)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleStep(step.stepNumber);
                                }
                            }}
                            className={`p-4 rounded-2xl bg-surface border transition-all cursor-pointer select-none space-y-3 ${
                                isDone
                                    ? 'border-primary/40 bg-primary/5 opacity-80'
                                    : 'border-border hover:border-border/80 hover:bg-surface-hover/50'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Step number / check badge */}
                                <span
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                        isDone
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
                })}
            </div>
        </section>
    );
};
