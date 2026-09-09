import React, { useState } from 'react';
import { IconPlus, IconTrash, IconArrowUp, IconArrowDown, IconChevronDown } from '@tabler/icons-react';
import { Input } from '../atoms/Input';
import { IconButton } from '../atoms/IconButton';

export interface SectionCardProps {
    title: string;
    sectionIndex: number;
    totalSections: number;
    titlePlaceholder?: string;
    itemCount: number;
    collapsedSummaryText?: React.ReactNode;
    emptyMessage?: string;
    addItemText: string;
    onChangeTitle: (title: string) => void;
    onAddItem: () => void;
    onRemoveSection: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    children: React.ReactNode;
    className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
    title,
    sectionIndex,
    totalSections,
    titlePlaceholder = 'Section Title (optional)',
    itemCount,
    collapsedSummaryText,
    emptyMessage = 'No items in this section yet.',
    addItemText,
    onChangeTitle,
    onAddItem,
    onRemoveSection,
    onMoveUp,
    onMoveDown,
    children,
    className = '',
}) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    return (
        <div className={`flex flex-col gap-3 p-3.5 sm:p-4 bg-surface-hover/60 rounded-2xl border border-border w-full min-w-0 ${className}`}>
            {/* Section Header Controls */}
            <div className="flex items-center gap-2 w-full min-w-0">
                <Input
                    placeholder={totalSections > 1 ? titlePlaceholder : 'Section Title (optional)'}
                    className="flex-1 min-w-0 font-semibold text-sm h-9 bg-surface"
                    value={title}
                    onChange={(e) => onChangeTitle(e.target.value)}
                />

                <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface/80 transition-colors shrink-0 flex items-center justify-center min-w-[32px] min-h-[32px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                            <IconButton
                                icon={IconArrowUp}
                                size="small"
                                onClick={onMoveUp}
                                disabled={sectionIndex === 0}
                                ariaLabel="Move section up"
                                title="Move section up"
                            />
                        )}
                        {onMoveDown && (
                            <IconButton
                                icon={IconArrowDown}
                                size="small"
                                onClick={onMoveDown}
                                disabled={sectionIndex === totalSections - 1}
                                ariaLabel="Move section down"
                                title="Move section down"
                            />
                        )}
                        <IconButton
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
                    className="py-2 px-3 rounded-xl bg-surface/60 border border-dashed border-border text-xs text-muted-foreground flex items-center justify-between cursor-pointer hover:bg-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <span>{collapsedSummaryText}</span>
                    <span className="font-semibold text-primary text-xs">Expand</span>
                </div>
            ) : (
                <>
                    {/* List of Section Items */}
                    <div className="flex flex-col gap-2.5 w-full min-w-0">
                        {children}

                        {itemCount === 0 && (
                            <div className="py-3 px-4 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
                                {emptyMessage}
                            </div>
                        )}
                    </div>

                    {/* Add Item Button */}
                    <button
                        type="button"
                        onClick={onAddItem}
                        className="w-full py-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <IconPlus className="w-4 h-4" stroke={2} />
                        <span>{addItemText}</span>
                    </button>
                </>
            )}
        </div>
    );
};
