import React, { useState } from 'react';
import { FormField } from './FormField';
import { Input } from '../atoms/Input';

export interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface SignUpFormProps {
    onSubmit: (data: SignUpFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    onError?: (message: string | null) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
    onSubmit,
    onCancel,
    isLoading = false,
    onError,
}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onError?.(null);

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
            onError?.('Please fill out all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            onError?.('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            onError?.('Password must be at least 6 characters.');
            return;
        }

        await onSubmit({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <FormField>
                    <Input
                        id="firstName"
                        name="given-name"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        required
                        disabled={isLoading}
                    />
                </FormField>

                <FormField>
                    <Input
                        id="lastName"
                        name="family-name"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                        required
                        disabled={isLoading}
                    />
                </FormField>
            </div>

            <FormField>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={isLoading}
                />
            </FormField>

            <FormField>
                <Input
                    id="new-password"
                    name="new-password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                />
            </FormField>

            <FormField>
                <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                />
            </FormField>

            {/* Button Group: Cancel and Sign Up */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 h-11 min-h-[44px] flex items-center justify-center border border-border bg-surface hover:bg-surface-hover text-foreground font-medium rounded-xl transition-colors active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-11 min-h-[44px] flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-sm transition-colors active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
            </div>
        </form>
    );
};
