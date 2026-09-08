import { useState, forwardRef, useImperativeHandle } from 'react';
import { IconRotate2, IconListCheck, IconChevronDown } from '@tabler/icons-react';
import type { InstructionSection } from '../../types/recipe';
import { InstructionViewerItem } from '../molecules/InstructionViewerItem';

export interface RecipeViewerInstructionsProps {
    instructions: InstructionSection[];
    className?: string;
}

export interface RecipeViewerInstructionsHandle {
    scrollToFirstUncheckedStep: () => void;
}

export const RecipeViewerInstructions = forwardRef<
    RecipeViewerInstructionsHandle,
    RecipeViewerInstructionsProps
>(({
    instructions,
    className = '',
}, ref) => {
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());
    const [isSectionCollapsed, setIsSectionCollapsed] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        scrollToFirstUncheckedStep: () => {
            const hadSectionCollapsed = isSectionCollapsed;
            if (isSectionCollapsed) {
                setIsSectionCollapsed(false);
            }

            // Find first unchecked step across all sections
            let targetStepNumber: number | null = null;
            let targetSectionIdx: number | null = null;

            for (let sIdx = 0; sIdx < instructions.length; sIdx++) {
                const sec = instructions[sIdx];
                for (const step of sec.steps || []) {
                    if (!completedSteps.has(step.stepNumber)) {
                        targetStepNumber = step.stepNumber;
                        targetSectionIdx = sIdx;
                        break;
                    }
                }
                if (targetStepNumber !== null) break;
            }

            const hadSubSectionCollapsed = targetSectionIdx !== null && collapsedSections.has(targetSectionIdx);
            if (hadSubSectionCollapsed) {
                setCollapsedSections((prev) => {
                    const next = new Set(prev);
                    next.delete(targetSectionIdx!);
                    return next;
                });
            }

            const executeScroll = () => {
                const targetElement = targetStepNumber !== null
                    ? document.getElementById(`instruction-step-${targetStepNumber}`)
                    : document.getElementById('recipe-instructions');

                if (targetElement) {
                    const y = targetElement.getBoundingClientRect().top + window.scrollY - 20;
                    window.scrollTo({ top: y, behavior: 'smooth' });

                    if (targetStepNumber !== null) {
                        targetElement.classList.add('ring-2', 'ring-primary/60');
                        setTimeout(() => {
                            targetElement.classList.remove('ring-2', 'ring-primary/60');
                        }, 1200);
                    }
                } else {
                    const fallbackEl = document.getElementById('recipe-instructions');
                    if (fallbackEl) {
                        const y = fallbackEl.getBoundingClientRect().top + window.scrollY - 20;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                }
            };

            if (hadSectionCollapsed || hadSubSectionCollapsed) {
                setTimeout(executeScroll, 60);
            } else {
                executeScroll();
            }
        },
    }));

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

    const toggleSectionCollapse = (secIdx: number) => {
        setCollapsedSections((prev) => {
            const next = new Set(prev);
            if (next.has(secIdx)) {
                next.delete(secIdx);
            } else {
                next.add(secIdx);
            }
            return next;
        });
    };

    const handleReset = () => {
        setCompletedSteps(new Set());
    };

    if (!instructions || totalSteps === 0) {
        return (
            <div id="recipe-instructions" className={`scroll-mt-6 p-4 rounded-xl bg-surface border border-border text-center text-xs text-muted-foreground ${className}`}>
                No instruction steps listed for this recipe.
            </div>
        );
    }

    const hasSections = instructions.length > 1 || instructions.some((sec) => !!sec.title?.trim());

    return (
        <section id="recipe-instructions" className={`scroll-mt-6 space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
                    className="flex items-center gap-2 text-left group select-none focus:outline-none rounded-lg py-1 px-1 -ml-1 hover:bg-surface-hover/80 transition-colors"
                    aria-expanded={!isSectionCollapsed}
                    title={isSectionCollapsed ? 'Expand Instructions' : 'Collapse Instructions'}
                >
                    <IconListCheck className="w-5 h-5 text-primary" stroke={1.5} />
                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Instructions</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover text-muted-foreground font-medium">
                        {totalSteps} {totalSteps === 1 ? 'step' : 'steps'}
                    </span>
                    <IconChevronDown
                        className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                            isSectionCollapsed ? '-rotate-90' : 'rotate-0'
                        }`}
                        stroke={2}
                    />
                </button>

                {!isSectionCollapsed && completedSteps.size > 0 && (
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

            {!isSectionCollapsed && (
                <div className="space-y-5">
                {instructions.map((sec, secIdx) => {
                    if (!sec.steps || sec.steps.length === 0) return null;
                    const isCollapsed = collapsedSections.has(secIdx);
                    const sectionTitle = sec.title?.trim() || (hasSections ? `Phase ${secIdx + 1}` : '');

                    return (
                        <div key={secIdx} className="space-y-3">
                            {sectionTitle && (
                                <button
                                    type="button"
                                    onClick={() => toggleSectionCollapse(secIdx)}
                                    className="w-full flex items-center justify-between px-1 py-1 text-left select-none group focus:outline-none"
                                    aria-expanded={!isCollapsed}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                                            {sectionTitle}
                                        </h3>
                                        <IconChevronDown
                                            className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'
                                                }`}
                                            stroke={2}
                                        />
                                    </div>
                                    <span className="text-[11px] text-muted-foreground font-medium">
                                        {sec.steps.length} {sec.steps.length === 1 ? 'step' : 'steps'}
                                    </span>
                                </button>
                            )}

                            {!isCollapsed && (
                                <div className="space-y-1">
                                    {sec.steps.map((step) => (
                                        <InstructionViewerItem
                                            key={step.stepNumber}
                                            step={step}
                                            isDone={completedSteps.has(step.stepNumber)}
                                            onToggle={() => toggleStep(step.stepNumber)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
                </div>
            )}
        </section>
    );
});

RecipeViewerInstructions.displayName = 'RecipeViewerInstructions';
