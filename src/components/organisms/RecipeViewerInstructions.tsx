import React, { useState } from 'react';
import { IconRotate2, IconListCheck } from '@tabler/icons-react';
import type { InstructionSection } from '../../types/recipe';
import { InstructionViewerItem } from '../molecules/InstructionViewerItem';

export interface RecipeViewerInstructionsProps {
    instructions: InstructionSection[];
    className?: string;
}

export const RecipeViewerInstructions: React.FC<RecipeViewerInstructionsProps> = ({
    instructions,
    className = '',
}) => {
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    const totalSteps = instructions.reduce((acc, sec) => acc + (sec.steps?.length || 0), 0);

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

    if (!instructions || totalSteps === 0) {
        return (
            <div className={`p-4 rounded-xl bg-surface border border-border text-center text-xs text-muted-foreground ${className}`}>
                No instruction steps listed for this recipe.
            </div>
        );
    }

    const hasSections = instructions.length > 1 || instructions.some((sec) => !!sec.title?.trim());

    return (
        <section className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IconListCheck className="w-5 h-5 text-primary" stroke={1.5} />
                    <h2 className="text-lg font-bold text-foreground">Instructions</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted-foreground font-medium">
                        {totalSteps} {totalSteps === 1 ? 'step' : 'steps'}
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

            <div className="space-y-5">
                {instructions.map((sec, secIdx) => {
                    if (!sec.steps || sec.steps.length === 0) return null;
                    return (
                        <div key={secIdx} className="space-y-3">
                            {hasSections && sec.title && (
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        {sec.title}
                                    </h3>
                                    <span className="text-[11px] text-muted-foreground font-medium">
                                        {sec.steps.length} {sec.steps.length === 1 ? 'step' : 'steps'}
                                    </span>
                                </div>
                            )}
                            <div className="space-y-3">
                                {sec.steps.map((step) => (
                                    <InstructionViewerItem
                                        key={step.stepNumber}
                                        step={step}
                                        isDone={completedSteps.has(step.stepNumber)}
                                        onToggle={() => toggleStep(step.stepNumber)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
