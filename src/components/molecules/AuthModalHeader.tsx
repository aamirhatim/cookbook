import React from 'react';
import { IconNotebook } from '@tabler/icons-react';

export interface AuthModalHeaderProps {
    title: string;
    description: string;
    mode: 'signup' | 'login';
    onModeChange: (mode: 'signup' | 'login') => void;
}

export const AuthModalHeader: React.FC<AuthModalHeaderProps> = ({
    title,
    description,
    mode,
    onModeChange,
}) => {
    return (
        <div className="space-y-4 text-center">
            {/* Brand Icon */}
            <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mx-auto mb-2">
                <IconNotebook className="w-6 h-6" stroke={1.5} />
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
                    {description}
                </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-muted p-1 text-xs font-medium">
                <button
                    type="button"
                    onClick={() => onModeChange('signup')}
                    className={`flex-1 py-1.5 rounded-lg transition-colors ${
                        mode === 'signup'
                            ? 'bg-surface text-foreground shadow-sm font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Sign Up
                </button>
                <button
                    type="button"
                    onClick={() => onModeChange('login')}
                    className={`flex-1 py-1.5 rounded-lg transition-colors ${
                        mode === 'login'
                            ? 'bg-surface text-foreground shadow-sm font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};
