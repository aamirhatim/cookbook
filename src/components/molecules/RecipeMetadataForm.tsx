import React from 'react';
import type { Recipe } from '../../types/recipe';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { FormField } from './FormField';
import { RecipeImageUploader } from './RecipeImageUploader';
import { RecipeUrlsFields } from './RecipeUrlsFields';
import { StepperInput } from './StepperInput';
import { RecipeDietarySelectors } from './RecipeDietarySelectors';
import { CommaDelimitedInput } from './CommaDelimitedInput';

export interface RecipeMetadataFormProps {
    formData: Partial<Recipe>;
    onChange: <K extends keyof Recipe>(field: K, value: Recipe[K]) => void;
    selectedImageFile: File | null;
    removeExistingImage: boolean;
    onSelectImage: (file: File) => void;
    onRemoveImage: () => void;
    disabled?: boolean;
}

export const RecipeMetadataForm: React.FC<RecipeMetadataFormProps> = ({
    formData,
    onChange,
    selectedImageFile,
    removeExistingImage,
    onSelectImage,
    onRemoveImage,
    disabled = false,
}) => {
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

            {/* Right Column: Metadata, Timing, Dietary & Tags */}
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

                <RecipeDietarySelectors
                    servings={formData.servings}
                    onServingsChange={(servings) => onChange('servings', servings)}
                    difficulty={formData.difficulty}
                    onDifficultyChange={(difficulty) => onChange('difficulty', difficulty)}
                    isVeg={formData.isVeg}
                    onVegChange={(isVeg) => onChange('isVeg', isVeg)}
                    protein={formData.protein}
                    onProteinChange={(protein) => onChange('protein', protein)}
                    disabled={disabled}
                />

                <CommaDelimitedInput
                    label="Tags"
                    helperText="Comma separated (e.g. healthy, quick, dinner)"
                    placeholder="healthy, quick"
                    values={formData.tags}
                    onChange={(tags) => onChange('tags', tags)}
                    disabled={disabled}
                />

                <CommaDelimitedInput
                    label="Equipment"
                    helperText="Comma separated (e.g. Dutch oven, Stand mixer, Skillet)"
                    placeholder="Dutch oven, Skillet"
                    values={formData.equipment}
                    onChange={(equipment) => onChange('equipment', equipment)}
                    disabled={disabled}
                />

                <RecipeUrlsFields
                    urls={formData.urls}
                    onChange={(urls) => onChange('urls', urls)}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};
