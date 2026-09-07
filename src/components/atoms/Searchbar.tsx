import React from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';

export interface SearchbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onClear?: () => void;
  autoFocus?: boolean;
}

export const Searchbar: React.FC<SearchbarProps> = ({
  value,
  onChange,
  placeholder = 'Search recipes...',
  className = '',
  disabled = false,
  onClear,
  autoFocus = false,
}) => {
  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className={`relative flex items-center w-full min-w-0 ${className}`}>
      <div className="absolute left-3.5 pointer-events-none text-muted-foreground flex items-center justify-center">
        <IconSearch className="w-5 h-5" stroke={1} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className="w-full min-h-[44px] pl-11 pr-10 py-2.5 text-sm rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-1 min-w-[36px] min-h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground rounded-full hover:bg-surface-hover transition-colors"
        >
          <IconX className="w-4 h-4" stroke={1} />
        </button>
      )}
    </div>
  );
};

