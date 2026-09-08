import React, { useRef, useState, useEffect } from 'react';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { ImageUploadPlaceholder } from './ImageUploadPlaceholder';
import { useToast } from '../../hooks/useToast';

export interface RecipeImageUploaderProps {
  currentImageUrl?: string | null;
  selectedFile: File | null;
  onSelectImage: (file: File) => void;
  onRemoveImage: () => void;
  disabled?: boolean;
  className?: string;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const RecipeImageUploader: React.FC<RecipeImageUploaderProps> = ({
  currentImageUrl,
  selectedFile,
  onSelectImage,
  onRemoveImage,
  disabled = false,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  // Manage object URL lifecycle for newly selected image files
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const activeImageUrl = previewUrl || currentImageUrl || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset file input value so re-selecting the same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WebP).', 'error');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      showToast('Image must be 5MB or smaller.', 'error');
      return;
    }

    onSelectImage(file);
  };

  const handleOpenPicker = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onRemoveImage();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        aria-label="Upload recipe photo"
      />

      {!activeImageUrl ? (
        <ImageUploadPlaceholder
          onClick={handleOpenPicker}
          disabled={disabled}
          aria-label="Add Recipe Cover Photo"
        />
      ) : (
        <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden border border-border bg-surface shadow-sm group">
          <img
            src={activeImageUrl}
            alt="Recipe cover preview"
            className="w-full h-full object-cover"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-transparent to-foreground/25 flex items-end justify-end p-3 gap-2">
            <ButtonIcon
              icon={IconPencil}
              iconStroke={1}
              onClick={handleOpenPicker}
              disabled={disabled}
              ariaLabel="Change photo"
              title="Change photo"
              className="shadow-md backdrop-blur-xs"
            />

            <ButtonIcon
              icon={IconTrash}
              iconStroke={1}
              onClick={handleRemove}
              disabled={disabled}
              ariaLabel="Remove photo"
              title="Remove photo"
              className="shadow-md backdrop-blur-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};
