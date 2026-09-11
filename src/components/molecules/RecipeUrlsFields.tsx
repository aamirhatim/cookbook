import React from 'react';
import type { RecipeUrls } from '../../types/recipe';
import { Input } from '../atoms/Input';
import { FormField } from './FormField';

export interface RecipeUrlsFieldsProps {
    urls?: RecipeUrls;
    onChange: (urls: RecipeUrls) => void;
    disabled?: boolean;
}

export const RecipeUrlsFields: React.FC<RecipeUrlsFieldsProps> = ({
    urls,
    onChange,
    disabled = false,
}) => {
    const handleFieldChange = (field: keyof RecipeUrls, value: string) => {
        onChange({
            ...urls,
            [field]: value,
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1.5fr] gap-3 items-start">
            <FormField label="Inspiration">
                <Input
                    placeholder="e.g. Kenji"
                    value={urls?.label || ''}
                    onChange={(e) => handleFieldChange('label', e.target.value)}
                    disabled={disabled}
                />
            </FormField>

            <FormField label="Video">
                <Input
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={urls?.video || ''}
                    onChange={(e) => handleFieldChange('video', e.target.value)}
                    disabled={disabled}
                />
            </FormField>

            <FormField label="Website">
                <Input
                    type="url"
                    placeholder="https://..."
                    value={urls?.website || ''}
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                    disabled={disabled}
                />
            </FormField>
        </div>
    );
};

export default RecipeUrlsFields;
