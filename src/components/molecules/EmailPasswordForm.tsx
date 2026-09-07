import React, { useState } from 'react';
import { FormField } from './FormField';
import { Input } from '../atoms/Input';

export interface EmailPasswordFormProps {
    onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
    isLoading?: boolean;
    submitLabel?: string;
}

export const EmailPasswordForm: React.FC<EmailPasswordFormProps> = ({
    onSubmit,
    isLoading = false,
    submitLabel = 'Sign In',
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password) return;
        await onSubmit({ email: email.trim(), password });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                    disabled={isLoading}
                />
            </FormField>

            <FormField>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                />
            </FormField>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 min-h-[44px] px-4 rounded-xl shadow-sm transition-colors active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Signing in...' : submitLabel}
            </button>
        </form>
    );
};
