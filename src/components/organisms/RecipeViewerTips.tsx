import { useState, forwardRef, useImperativeHandle } from 'react';
import { IconSparkleHighlight, IconChevronDown } from '@tabler/icons-react';
import { TipViewerItem } from '../molecules/TipViewerItem';

export interface RecipeViewerTipsProps {
    tips: string[];
    className?: string;
}

export interface RecipeViewerTipsHandle {
    scrollToTips: () => void;
}

export const RecipeViewerTips = forwardRef<
    RecipeViewerTipsHandle,
    RecipeViewerTipsProps
>(({
    tips,
    className = '',
}, ref) => {
    const [isSectionCollapsed, setIsSectionCollapsed] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        scrollToTips: () => {
            if (isSectionCollapsed) {
                setIsSectionCollapsed(false);
            }

            const executeScroll = () => {
                const el = document.getElementById('recipe-tips');
                if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 20;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            };

            if (isSectionCollapsed) {
                setTimeout(executeScroll, 60);
            } else {
                executeScroll();
            }
        },
    }));

    if (!tips || tips.length === 0) {
        return null;
    }

    return (
        <section id="recipe-tips" className={`scroll-mt-6 space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
                    className="flex items-center gap-2 text-left group select-none focus:outline-none rounded-lg py-1 px-1 -ml-1 hover:bg-surface-hover/80 transition-colors"
                    aria-expanded={!isSectionCollapsed}
                    title={isSectionCollapsed ? 'Expand Tips' : 'Collapse Tips'}
                >
                    <IconSparkleHighlight className="w-5 h-5 text-primary" stroke={1.5} />
                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        Tips
                    </h2>
                    <IconChevronDown
                        className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                            isSectionCollapsed ? '-rotate-90' : 'rotate-0'
                        }`}
                        stroke={2}
                    />
                </button>
            </div>

            {!isSectionCollapsed && (
                <div className="py-1 rounded-2xl bg-surface border border-border divide-y divide-border/50 overflow-hidden shadow-sm">
                    {tips.map((tip, idx) => (
                        <TipViewerItem key={idx} tip={tip} />
                    ))}
                </div>
            )}
        </section>
    );
});

RecipeViewerTips.displayName = 'RecipeViewerTips';
