import React, { useState, useEffect, useRef } from 'react';
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
import { IconButton } from '../atoms/IconButton';
import { FormField } from './FormField';
import { RecipeImageUploader } from './RecipeImageUploader';
import { RecipeUrlsFields } from './RecipeUrlsFields';
import { StepperInput } from './StepperInput';

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
    { value: 'fish', label: 'Seafood', icon: IconFish },
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
    const [tagsInput, setTagsInput] = useState(() => (formData.tags || []).join(', '));
    const [equipmentInput, setEquipmentInput] = useState(() => (formData.equipment || []).join(', '));

    const lastTagsEmittedRef = useRef<string>(JSON.stringify(formData.tags || []));
    const lastEquipmentEmittedRef = useRef<string>(JSON.stringify(formData.equipment || []));

    useEffect(() => {
        const currentSerialized = JSON.stringify(formData.tags || []);
        if (currentSerialized !== lastTagsEmittedRef.current) {
            lastTagsEmittedRef.current = currentSerialized;
            setTagsInput((formData.tags || []).join(', '));
        }
    }, [formData.tags]);

    useEffect(() => {
        const currentSerialized = JSON.stringify(formData.equipment || []);
        if (currentSerialized !== lastEquipmentEmittedRef.current) {
            lastEquipmentEmittedRef.current = currentSerialized;
            setEquipmentInput((formData.equipment || []).join(', '));
        }
    }, [formData.equipment]);

    const handleTagsChange = (val: string) => {
        setTagsInput(val);
        const tagsArray = val.split(',').map((t) => t.trim()).filter(Boolean);
        lastTagsEmittedRef.current = JSON.stringify(tagsArray);
        onChange('tags', tagsArray);
    };

    const handleTagsBlur = () => {
        const formatted = (formData.tags || []).join(', ');
        setTagsInput(formatted);
    };

    const handleEquipmentChange = (val: string) => {
        setEquipmentInput(val);
        const equipArray = val.split(',').map((e) => e.trim()).filter(Boolean);
        lastEquipmentEmittedRef.current = JSON.stringify(equipArray);
        onChange('equipment', equipArray);
    };

    const handleEquipmentBlur = () => {
        const formatted = (formData.equipment || []).join(', ');
        setEquipmentInput(formatted);
    };

    const handleProteinToggle = (proteinItem: ProteinType) => {
        const current = formData.protein || [];
        const next = current.includes(proteinItem)
            ? current.filter((p) => p !== proteinItem)
            : [...current, proteinItem];
        onChange('protein', next);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Column: Image, Title, Description */}
            <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-4">
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

                <FormField label="Description" className="flex-1 flex flex-col min-h-0">
                    <Textarea
                        placeholder="A brief description of this recipe..."
                        value={formData.description || ''}
                        onChange={(e) => onChange('description', e.target.value)}
                        disabled={disabled}
                        className="flex-1 min-h-[100px] h-full resize-y"
                    />
                </FormField>
            </div>

            {/* Right Column: Recipe Metadata Form Fields */}
            <div className="md:col-span-7 lg:col-span-7 flex flex-col gap-4">
                <FormField label="Cuisine">
                    <Input
                        placeholder="e.g. Italian, Mexican"
                        value={formData.cuisine || ''}
                        onChange={(e) => onChange('cuisine', e.target.value)}
                        disabled={disabled}
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <FormField label="Prep Time (min)">
                        <StepperInput
                            value={formData.prepTimeMinutes}
                            onChange={(val) => onChange('prepTimeMinutes', val)}
                            min={0}
                            step={5}
                            fieldSize="full"
                            placeholder="0"
                            ariaLabel="Prep Time"
                            disabled={disabled}
                        />
                    </FormField>

                    <FormField label="Cook Time (min)">
                        <StepperInput
                            value={formData.cookTimeMinutes}
                            onChange={(val) => onChange('cookTimeMinutes', val)}
                            min={0}
                            step={5}
                            fieldSize="full"
                            placeholder="0"
                            ariaLabel="Cook Time"
                            disabled={disabled}
                        />
                    </FormField>
                </div>

                <div className="flex items-start gap-3 sm:gap-4 flex-wrap">
                    <FormField label="Servings" className="shrink-0">
                        <StepperInput
                            value={formData.servings}
                            onChange={(val) => onChange('servings', val)}
                            min={1}
                            step={1}
                            fieldSize="compact"
                            placeholder="1"
                            ariaLabel="Servings"
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
                                    <IconButton
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

                    <FormField label="Protein & Veg" className="shrink-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 h-11" role="group" aria-label="Protein and vegetarian selection">
                            <IconButton
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
                            <div className="w-px h-6 bg-border/60 mx-0.5" />
                            {PROTEIN_OPTIONS.map((item) => {
                                const isSelected = formData.protein?.includes(item.value) ?? false;
                                return (
                                    <IconButton
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
                        value={tagsInput}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        onBlur={handleTagsBlur}
                        disabled={disabled}
                    />
                </FormField>

                <FormField label="Equipment" helperText="Comma separated (e.g. Dutch oven, Stand mixer, Skillet)">
                    <Input
                        placeholder="Dutch oven, Skillet"
                        value={equipmentInput}
                        onChange={(e) => handleEquipmentChange(e.target.value)}
                        onBlur={handleEquipmentBlur}
                        disabled={disabled}
                    />
                </FormField>

                <RecipeUrlsFields
                    urls={formData.urls}
                    onChange={(urls) => onChange('urls', urls)}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};
