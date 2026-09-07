import React from 'react';
import { InstructionStep } from '../../types/recipe';
import { Textarea } from '../atoms/Textarea';
import { ButtonIcon } from '../atoms/ButtonIcon';
import { IconPlus, IconTrash, IconBulb } from '@tabler/icons-react';

export interface InstructionsFormListProps {
  instructions: InstructionStep[];
  onChange: (instructions: InstructionStep[]) => void;
}

export const InstructionsFormList: React.FC<InstructionsFormListProps> = ({ instructions, onChange }) => {
  const handleAdd = () => {
    onChange([...instructions, { stepNumber: instructions.length + 1, instruction: '' }]);
  };

  const handleRemove = (index: number) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    // Re-index
    newInstructions.forEach((step, i) => {
      step.stepNumber = i + 1;
    });
    onChange(newInstructions);
  };

  const handleChange = (index: number, field: keyof InstructionStep, value: string | number) => {
    const newInstructions = [...instructions];
    newInstructions[index] = { ...newInstructions[index], [field]: value };
    onChange(newInstructions);
  };

  const handleRemoveTip = (index: number) => {
    const newInstructions = [...instructions];
    const { tip, ...rest } = newInstructions[index];
    newInstructions[index] = rest;
    onChange(newInstructions);
  };

  return (
    <div className="flex flex-col gap-4">
      {instructions.map((step, i) => (
        <div key={i} className="flex flex-col gap-3 p-4 bg-surface-hover rounded-xl border border-border relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Step {step.stepNumber}</span>
            <ButtonIcon
              icon={IconTrash}
              size="small"
              onClick={() => handleRemove(i)}
              ariaLabel="Remove step"
              title="Remove step"
            />
          </div>
          
          <Textarea 
            placeholder="Describe this step..." 
            value={step.instruction}
            onChange={(e) => handleChange(i, 'instruction', e.target.value)}
            className="min-h-[100px]"
          />

          {step.tip !== undefined ? (
            <div className="flex gap-2 items-start mt-1 relative">
              <div className="pt-2 text-accent">
                <IconBulb className="w-5 h-5" stroke={1} />
              </div>
              <Textarea 
                placeholder="Add a tip for this step..." 
                value={step.tip}
                onChange={(e) => handleChange(i, 'tip', e.target.value)}
                className="min-h-[60px] text-sm flex-1 bg-surface"
              />
              <ButtonIcon
                icon={IconTrash}
                size="small"
                onClick={() => handleRemoveTip(i)}
                ariaLabel="Remove tip"
                title="Remove tip"
                className="absolute top-2 right-2"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleChange(i, 'tip', '')}
              className="self-start text-xs font-medium text-accent hover:text-accent/80 flex items-center gap-1.5 mt-1"
            >
              <IconBulb className="w-4 h-4" stroke={1} />
              Add Tip
            </button>
          )}

        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors bg-surface"
      >
        <IconPlus className="w-5 h-5" stroke={1} />
        Add Step
      </button>
    </div>
  );
};
