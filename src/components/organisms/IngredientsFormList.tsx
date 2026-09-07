import React from 'react';
import { Ingredient } from '../../types/recipe';
import { Input } from '../atoms/Input';
import { IconPlus, IconTrash } from '@tabler/icons-react';

export interface IngredientsFormListProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

export const IngredientsFormList: React.FC<IngredientsFormListProps> = ({ ingredients, onChange }) => {
  const handleAdd = () => {
    onChange([...ingredients, { name: '', amount: 0, unit: '', notes: '' }]);
  };

  const handleRemove = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    onChange(newIngredients);
  };

  const handleChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    onChange(newIngredients);
  };

  return (
    <div className="flex flex-col gap-4">
      {ingredients.map((ing, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 bg-surface-hover rounded-xl border border-border relative overflow-hidden">
          <div className="flex gap-2 items-center w-full">
            <Input 
              type="number"
              placeholder="Qty" 
              className="w-14 sm:w-16 flex-shrink-0 px-2 h-9"
              value={ing.amount || ''}
              onChange={(e) => handleChange(i, 'amount', parseFloat(e.target.value) || 0)}
            />
            <Input 
              placeholder="Unit" 
              className="w-16 sm:w-20 flex-shrink-0 px-2 h-9"
              value={ing.unit}
              onChange={(e) => handleChange(i, 'unit', e.target.value)}
            />
            <Input 
              placeholder="Name (e.g. flour)" 
              className="flex-1 min-w-0 h-9"
              value={ing.name}
              onChange={(e) => handleChange(i, 'name', e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center w-full">
            <Input 
              placeholder="Notes (optional, e.g. sifted)" 
              className="flex-1 min-w-0 text-sm h-9 bg-surface/50"
              value={ing.notes || ''}
              onChange={(e) => handleChange(i, 'notes', e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Remove ingredient"
            >
              <IconTrash className="w-5 h-5" stroke={1} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors bg-surface"
      >
        <IconPlus className="w-5 h-5" stroke={1} />
        Add Ingredient
      </button>
    </div>
  );
};
