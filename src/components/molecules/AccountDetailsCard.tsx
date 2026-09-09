import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMail, IconLogout, IconShieldCheck, IconTrash } from '@tabler/icons-react';
import { Button } from '../atoms/Button';
import type { UserProfile } from '../../types/user';

interface AccountDetailsCardProps {
    profile: UserProfile | null;
    role?: string | null;
    loading?: boolean;
    onLogout: () => void;
    isLoggingOut?: boolean;
    onDeleteAccount: () => void;
    isDeletingAccount?: boolean;
}

export const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({
    profile,
    role,
    loading = false,
    onLogout,
    isLoggingOut = false,
    onDeleteAccount,
    isDeletingAccount = false,
}) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    if (loading) {
        return (
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm animate-pulse space-y-6">
                <div className="space-y-2">
                    <div className="h-6 bg-muted rounded w-36" />
                    <div className="h-4 bg-muted rounded w-48" />
                </div>
                <div className="pt-2 border-t border-border space-y-3">
                    <div className="h-11 bg-muted rounded-xl w-full" />
                    <div className="h-11 bg-muted rounded-xl w-full" />
                </div>
            </div>
        );
    }

    const displayName =
        profile?.displayName?.trim() ||
        `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() ||
        'Chef';

    const email = profile?.email || 'No email provided';

    return (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
            {/* User Identity Header */}
            <div>
                <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-foreground truncate">
                        {displayName}
                    </h2>
                    {role && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary text-tertiary-foreground border border-border shrink-0 capitalize">
                            {role === 'admin' && <IconShieldCheck className="w-3.5 h-3.5 text-primary" stroke={1.5} />}
                            <span>{role}</span>
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center space-x-1.5 mt-1 truncate">
                    <IconMail className="w-4 h-4 shrink-0 text-muted-foreground" stroke={1.5} />
                    <span className="truncate">{email}</span>
                </p>

                {/* Admin Navigation Link */}
                {role === 'admin' && (
                    <div className="pt-3">
                        <Link
                            to="/admin/recipes"
                            className={`inline-flex items-center text-sm font-medium text-primary hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${
                                isLoggingOut || isDeletingAccount ? 'pointer-events-none opacity-50' : ''
                            }`}
                        >
                            Go to recipe list
                        </Link>
                    </div>
                )}
            </div>

            {/* Account Actions */}
            <div className="pt-2 border-t border-border space-y-3">
                {/* Sign Out Button */}
                <Button
                    icon={IconLogout}
                    text="Sign Out"
                    width="full"
                    variant="subtle"
                    loading={isLoggingOut}
                    disabled={isLoggingOut || isDeletingAccount}
                    onClick={onLogout}
                />

                {/* Delete Account Flow */}
                {isConfirmingDelete ? (
                    <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3">
                        <div className="space-y-1 text-left">
                            <h4 className="text-sm font-semibold text-destructive">Delete Account</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Are you sure you want to permanently delete your account and profile data? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <Button
                                text="Cancel"
                                width="fill"
                                variant="subtle"
                                disabled={isDeletingAccount}
                                onClick={() => setIsConfirmingDelete(false)}
                            />
                            <Button
                                icon={IconTrash}
                                text="Confirm Delete"
                                width="fill"
                                variant="destructive"
                                loading={isDeletingAccount}
                                disabled={isDeletingAccount}
                                onClick={onDeleteAccount}
                            />
                        </div>
                    </div>
                ) : (
                    <Button
                        icon={IconTrash}
                        text="Delete Account"
                        width="full"
                        variant="destructive-subtle"
                        disabled={isLoggingOut || isDeletingAccount}
                        onClick={() => setIsConfirmingDelete(true)}
                    />
                )}
            </div>
        </div>
    );
};

