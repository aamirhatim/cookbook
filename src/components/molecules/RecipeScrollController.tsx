import type { FC } from 'react';
import {
    IconArrowBigUpLines,
    IconToolsKitchen,
    IconListCheck,
    IconSparkleHighlight,
} from '@tabler/icons-react';

export interface RecipeScrollControllerProps {
    onScrollToTop: () => void;
    onScrollToIngredients: () => void;
    onScrollToInstructions: () => void;
    onScrollToTips?: () => void;
    className?: string;
}

export const RecipeScrollController: FC<RecipeScrollControllerProps> = ({
    onScrollToTop,
    onScrollToIngredients,
    onScrollToInstructions,
    onScrollToTips,
    className = '',
}) => {
    const handleAction = (callback: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        callback();
    };

    const buttonClasses =
        'w-11 h-11 flex items-center justify-center rounded-xl text-muted-foreground bg-transparent select-none outline-none focus:outline-none transition-transform duration-100 active:scale-90 active:bg-primary/15 active:text-primary';

    return (
        <aside
            aria-label="Recipe quick scroll controls"
            className={`fixed bottom-6 right-4 sm:right-6 z-40 lg:hidden flex flex-col items-center bg-surface/90 backdrop-blur-md border border-border shadow-lg shadow-black/5 dark:shadow-black/20 rounded-2xl p-1 gap-0.5 ${className}`}
        >
            {/* Jump to tips section (if present) */}
            {onScrollToTips && (
                <>
                    <button
                        type="button"
                        onClick={handleAction(onScrollToTips)}
                        onPointerUp={(e) => e.currentTarget.blur()}
                        title="Tips"
                        aria-label="Scroll to recipe tips"
                        className={buttonClasses}
                    >
                        <IconSparkleHighlight size={22} stroke={1.5} />
                    </button>

                    <div className="w-5 h-px bg-border/60" />
                </>
            )}

            {/* Jump to ingredients section */}
            <button
                type="button"
                onClick={handleAction(onScrollToIngredients)}
                onPointerUp={(e) => e.currentTarget.blur()}
                title="Ingredients"
                aria-label="Scroll to ingredients"
                className={buttonClasses}
            >
                <IconToolsKitchen size={22} stroke={1} />
            </button>

            <div className="w-5 h-px bg-border/60" />

            {/* Jump to instructions section (first unchecked step) */}
            <button
                type="button"
                onClick={handleAction(onScrollToInstructions)}
                onPointerUp={(e) => e.currentTarget.blur()}
                title="Instructions"
                aria-label="Scroll to next instruction step"
                className={buttonClasses}
            >
                <IconListCheck size={22} stroke={1} />
            </button>

            <div className="w-5 h-px bg-border/60" />

            {/* Jump to top of page */}
            <button
                type="button"
                onClick={handleAction(onScrollToTop)}
                onPointerUp={(e) => e.currentTarget.blur()}
                title="Top of page"
                aria-label="Scroll to top of recipe"
                className={buttonClasses}
            >
                <IconArrowBigUpLines size={22} stroke={1} />
            </button>
        </aside>
    );
};
