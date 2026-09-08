import React, { useState } from 'react';
import { FormField } from './FormField';
import { Input } from '../atoms/Input';
import { ButtonIcon } from '../atoms/ButtonIcon';

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
                <FormField label="First Name" htmlFor="firstName">
                    <Input
                        id="firstName"
                        name="given-name"
                        type="text"
                        placeholder="Jane"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        required
                        disabled={isLoading}
                    />
                </FormField>

                <FormField label="Last Name" htmlFor="lastName">
                    <Input
                        id="lastName"
                        name="family-name"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                        required
                        disabled={isLoading}
                    />
                </FormField>
            </div>

            <FormField label="Email Address" htmlFor="email">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={isLoading}
                />
            </FormField>

            <FormField label="Password" htmlFor="new-password">
                <Input
                    id="new-password"
                    name="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                />
            </FormField>

            <FormField label="Confirm Password" htmlFor="confirm-password">
                <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                />
            </FormField>

            {/* Button Group: Cancel and Sign Up */}
            <div className="flex items-center gap-3 pt-2">
                <ButtonIcon
                    type="button"
                    width="expand"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                    text="Cancel"
                />
                <ButtonIcon
                    type="submit"
                    width="expand"
                    variant="primary"
                    loading={isLoading}
                    text={isLoading ? 'Signing up...' : 'Sign Up'}
                    disabled={isLoading}
                />
            </div>
        </form>
    );
};
