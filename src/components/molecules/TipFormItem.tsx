import React from 'react';
import { IconArrowUp, IconArrowDown, IconTrash } from '@tabler/icons-react';
import { Textarea } from '../atoms/Textarea';
import { IconButton } from '../atoms/IconButton';

export interface TipFormItemProps {
    index: number;
    tip: string;
    onChange: (text: string) => void;
    onRemove: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
    disabled?: boolean;
}

export const TipFormItem: React.FC<TipFormItemProps> = ({
    index,
    tip,
    onChange,
    onRemove,
    onMoveUp,
    onMoveDown,
    isFirst = false,
    isLast = false,
    disabled = false,
}) => {
    return (
        <div className="flex flex-col gap-2.5 p-3.5 bg-surface rounded-xl border border-border/70 relative w-full min-w-0">
            <div className="flex items-center justify-between w-full min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Tip {index + 1}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                    <IconButton
                        icon={IconArrowUp}
                        size="small"
                        onClick={onMoveUp}
                        disabled={isFirst || disabled}
                        ariaLabel={`Move tip ${index + 1} up`}
                        title="Move tip up"
                    />
                    <IconButton
                        icon={IconArrowDown}
                        size="small"
                        onClick={onMoveDown}
                        disabled={isLast || disabled}
                        ariaLabel={`Move tip ${index + 1} down`}
                        title="Move tip down"
                    />
                    <IconButton
                        icon={IconTrash}
                        size="small"
                        onClick={onRemove}
                        disabled={disabled}
                        ariaLabel={`Remove tip ${index + 1}`}
                        title="Remove tip"
                    />
                </div>
            </div>

            <Textarea
                placeholder="Add a helpful chef tip, trick, or substitution note..."
                value={tip}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="min-h-[60px] text-sm"
                rows={2}
            />
        </div>
    );
};
