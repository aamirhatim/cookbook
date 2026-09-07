import React from 'react';
import { IconPhotoHexagon } from '@tabler/icons-react';

export interface ImageUploadPlaceholderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export const ImageUploadPlaceholder = React.forwardRef<HTMLButtonElement, ImageUploadPlaceholderProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                className={`w-full h-[100px] flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface hover:bg-surface-hover hover:border-primary/50 transition-colors px-4 text-muted-foreground hover:text-primary ${className}`}
                {...props}
            >
                <IconPhotoHexagon className="w-8 h-8" stroke={1} />
                <span className="text-sm font-medium">Add Image</span>
            </button>
        );
    }
);
ImageUploadPlaceholder.displayName = 'ImageUploadPlaceholder';
