import React, { useState } from 'react';
import { FormField } from './FormField';
import { Input } from '../atoms/Input';
import { ButtonIcon } from '../atoms/ButtonIcon';

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
            <FormField label="Email Address" htmlFor="email">
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

            <FormField label="Password" htmlFor="password">
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

            <ButtonIcon
                type="submit"
                width="full"
                variant="primary"
                loading={isLoading}
                text={isLoading ? 'Signing in...' : submitLabel}
                disabled={isLoading}
            />
        </form>
    );
};
