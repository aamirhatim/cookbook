import React, { useCallback } from 'react';
import { IconPlus, IconSparkleHighlight } from '@tabler/icons-react';
import { TipFormItem } from '../molecules/TipFormItem';

export interface TipsFormListProps {
    tips: string[];
    onChange: (tips: string[]) => void;
    disabled?: boolean;
}

export const TipsFormList: React.FC<TipsFormListProps> = ({
    tips,
    onChange,
    disabled = false,
}) => {
    const handleAddItem = useCallback(() => {
        onChange([...tips, '']);
    }, [tips, onChange]);

    const handleUpdateItem = useCallback(
        (index: number, value: string) => {
            const next = [...tips];
            next[index] = value;
            onChange(next);
        },
        [tips, onChange]
    );

    const handleRemoveItem = useCallback(
        (index: number) => {
            const next = tips.filter((_, idx) => idx !== index);
            onChange(next);
        },
        [tips, onChange]
    );

    const handleMoveItem = useCallback(
        (index: number, direction: 'up' | 'down') => {
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= tips.length) return;
            const next = [...tips];
            const [moved] = next.splice(index, 1);
            next.splice(targetIndex, 0, moved);
            onChange(next);
        },
        [tips, onChange]
    );

    return (
        <div className="flex flex-col gap-3 w-full min-w-0">
            {tips.length === 0 ? (
                <div className="p-4 rounded-xl bg-surface border border-dashed border-border text-center space-y-2">
                    <p className="text-xs text-muted-foreground">
                        No tips added yet. Add chef advice, cooking techniques, or ingredient substitutions.
                    </p>
                    <button
                        type="button"
                        onClick={handleAddItem}
                        disabled={disabled}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <IconSparkleHighlight className="w-4 h-4" stroke={1.5} />
                        <span>Add First Tip</span>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {tips.map((tip, idx) => (
                        <TipFormItem
                            key={idx}
                            index={idx}
                            tip={tip}
                            onChange={(val) => handleUpdateItem(idx, val)}
                            onRemove={() => handleRemoveItem(idx)}
                            onMoveUp={() => handleMoveItem(idx, 'up')}
                            onMoveDown={() => handleMoveItem(idx, 'down')}
                            isFirst={idx === 0}
                            isLast={idx === tips.length - 1}
                            disabled={disabled}
                        />
                    ))}

                    <button
                        type="button"
                        onClick={handleAddItem}
                        disabled={disabled}
                        className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <IconPlus className="w-4 h-4" stroke={1.5} />
                        <span>Add Tip</span>
                    </button>
                </div>
            )}
        </div>
    );
};
