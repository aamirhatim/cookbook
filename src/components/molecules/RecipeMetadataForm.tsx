import React from 'react';
import {
  IconHexagonLetterE,
  IconHexagonLetterM,
  IconHexagonLetterH,
  IconCarrot,
  IconFish,
  IconCanary,
  IconMeat,
  IconCube,
} from '@tabler/icons-react';
import type { Recipe, Difficulty, ProteinType } from '../../types/recipe';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { FormField } from './FormField';
import { RecipeImageUploader } from './RecipeImageUploader';

export interface RecipeMetadataFormProps {
  formData: Partial<Recipe>;
  onChange: <K extends keyof Recipe>(field: K, value: Recipe[K]) => void;
  selectedImageFile: File | null;
  removeExistingImage: boolean;
  onSelectImage: (file: File) => void;
  onRemoveImage: () => void;
  disabled?: boolean;
}

const PROTEIN_OPTIONS: { value: ProteinType; label: string; icon: typeof IconFish }[] = [
  { value: 'fish', label: 'Fish', icon: IconFish },
  { value: 'poultry', label: 'Poultry', icon: IconCanary },
  { value: 'red meat', label: 'Red Meat', icon: IconMeat },
  { value: 'tofu', label: 'Tofu', icon: IconCube },
];

export const RecipeMetadataForm: React.FC<RecipeMetadataFormProps> = ({
  formData,
  onChange,
  selectedImageFile,
  removeExistingImage,
  onSelectImage,
  onRemoveImage,
  disabled = false,
}) => {
  const handleTagsChange = (val: string) => {
    const tagsArray = val.split(',').map((t) => t.trim()).filter(Boolean);
    onChange('tags', tagsArray);
  };

  const handleEquipmentChange = (val: string) => {
    const equipArray = val.split(',').map((e) => e.trim()).filter(Boolean);
    onChange('equipment', equipArray);
  };

  const handleProteinToggle = (proteinItem: ProteinType) => {
    const current = formData.protein || [];
    const next = current.includes(proteinItem)
      ? current.filter((p) => p !== proteinItem)
      : [...current, proteinItem];
    onChange('protein', next);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Left Column: Image, Title, Description */}
      <div className="md:col-span-5 lg:col-span-5 space-y-4">
        <RecipeImageUploader
          currentImageUrl={removeExistingImage ? null : formData.imageUrl}
          selectedFile={selectedImageFile}
          onSelectImage={onSelectImage}
          onRemoveImage={onRemoveImage}
          disabled={disabled}
        />

        <FormField label="Recipe Title">
          <Input
            placeholder="e.g. Grandma's Apple Pie"
            value={formData.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            disabled={disabled}
          />
        </FormField>

        <FormField label="Description">
          <Textarea
            placeholder="A brief description of this recipe..."
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            disabled={disabled}
          />
        </FormField>
      </div>

      {/* Right Column: Recipe Metadata Form Fields */}
      <div className="md:col-span-7 lg:col-span-7 space-y-4">
        <FormField label="Cuisine">
          <Input
            placeholder="e.g. Italian, Mexican"
            value={formData.cuisine || ''}
            onChange={(e) => onChange('cuisine', e.target.value)}
            disabled={disabled}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Prep Time (min)">
            <Input
              type="number"
              placeholder="0"
              value={formData.prepTimeMinutes || ''}
              onChange={(e) => onChange('prepTimeMinutes', parseInt(e.target.value, 10) || 0)}
              disabled={disabled}
            />
          </FormField>
          <FormField label="Cook Time (min)">
            <Input
              type="number"
              placeholder="0"
              value={formData.cookTimeMinutes || ''}
              onChange={(e) => onChange('cookTimeMinutes', parseInt(e.target.value, 10) || 0)}
              disabled={disabled}
            />
          </FormField>
        </div>

        <div className="flex items-start gap-3 sm:gap-4 flex-wrap">
          <FormField label="Servings" className="w-20 sm:w-24 shrink-0">
            <Input
              type="number"
              min={1}
              placeholder="1"
              value={formData.servings || ''}
              onChange={(e) => onChange('servings', parseInt(e.target.value, 10) || 1)}
              disabled={disabled}
            />
          </FormField>

          <FormField label="Difficulty" className="shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 h-11" role="radiogroup" aria-label="Difficulty">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => {
                const icon =
                  diff === 'easy'
                    ? IconHexagonLetterE
                    : diff === 'medium'
                    ? IconHexagonLetterM
                    : IconHexagonLetterH;
                const label = diff.charAt(0).toUpperCase() + diff.slice(1);
                return (
                  <ButtonIcon
                    key={diff}
                    type="button"
                    role="radio"
                    icon={icon}
                    active={formData.difficulty === diff}
                    onClick={() => onChange('difficulty', diff)}
                    title={label}
                    ariaLabel={`${label} difficulty`}
                    aria-checked={formData.difficulty === diff}
                    aria-pressed={formData.difficulty === diff}
                    variant="subtle"
                    iconSize={22}
                    iconStroke={1.5}
                    disabled={disabled}
                  />
                );
              })}
            </div>
          </FormField>

          <FormField label="Vegetarian" className="shrink-0">
            <div className="flex items-center h-11">
              <ButtonIcon
                type="button"
                icon={IconCarrot}
                isToggle
                active={formData.isVeg || false}
                onClick={() => onChange('isVeg', !formData.isVeg)}
                title={formData.isVeg ? 'Vegetarian (Active)' : 'Mark as Vegetarian'}
                ariaLabel="Vegetarian"
                variant="subtle"
                iconSize={22}
                iconStroke={1.5}
                disabled={disabled}
              />
            </div>
          </FormField>

          <FormField label="Protein" className="shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 h-11" role="group" aria-label="Protein selection">
              {PROTEIN_OPTIONS.map((item) => {
                const isSelected = formData.protein?.includes(item.value) ?? false;
                return (
                  <ButtonIcon
                    key={item.value}
                    type="button"
                    icon={item.icon}
                    isToggle
                    active={isSelected}
                    onClick={() => handleProteinToggle(item.value)}
                    title={isSelected ? `${item.label} (Selected)` : item.label}
                    ariaLabel={item.label}
                    aria-pressed={isSelected}
                    variant="subtle"
                    iconSize={22}
                    iconStroke={1.5}
                    disabled={disabled}
                  />
                );
              })}
            </div>
          </FormField>
        </div>

        <FormField label="Tags" helperText="Comma separated (e.g. healthy, quick, dinner)">
          <Input
            placeholder="healthy, quick"
            value={formData.tags?.join(', ') || ''}
            onChange={(e) => handleTagsChange(e.target.value)}
            disabled={disabled}
          />
        </FormField>

        <FormField label="Equipment" helperText="Comma separated (e.g. Dutch oven, Stand mixer, Skillet)">
          <Input
            placeholder="Dutch oven, Skillet"
            value={formData.equipment?.join(', ') || ''}
            onChange={(e) => handleEquipmentChange(e.target.value)}
            disabled={disabled}
          />
        </FormField>
      </div>
    </div>
  );
};
