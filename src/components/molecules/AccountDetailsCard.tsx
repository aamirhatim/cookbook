import React, { useState } from 'react';
import { IconMail, IconLogout, IconShieldCheck, IconTrash } from '@tabler/icons-react';
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
            </div>

            {/* Account Actions */}
            <div className="pt-2 border-t border-border space-y-3">
                {/* Sign Out Button */}
                <button
                    type="button"
                    onClick={onLogout}
                    disabled={isLoggingOut || isDeletingAccount}
                    className="w-full flex items-center justify-center space-x-2 min-h-[44px] px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-hover active:bg-surface text-foreground font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                >
                    {isLoggingOut ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-foreground border-t-transparent" />
                    ) : (
                        <>
                            <IconLogout className="w-4 h-4" stroke={1.5} />
                            <span>Sign Out</span>
                        </>
                    )}
                </button>

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
                            <button
                                type="button"
                                onClick={() => setIsConfirmingDelete(false)}
                                disabled={isDeletingAccount}
                                className="flex-1 flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-foreground font-medium text-xs transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onDeleteAccount}
                                disabled={isDeletingAccount}
                                className="flex-1 flex items-center justify-center space-x-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium text-xs shadow-xs transition-colors disabled:opacity-50 active:scale-98"
                            >
                                {isDeletingAccount ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-destructive-foreground border-t-transparent" />
                                ) : (
                                    <>
                                        <IconTrash className="w-4 h-4" stroke={1.5} />
                                        <span>Confirm Delete</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsConfirmingDelete(true)}
                        disabled={isLoggingOut || isDeletingAccount}
                        className="w-full flex items-center justify-center space-x-2 min-h-[44px] px-4 py-2.5 rounded-xl border border-destructive/30 bg-destructive/10 hover:bg-destructive/15 active:bg-destructive/20 text-destructive font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                    >
                        <IconTrash className="w-4 h-4" stroke={1.5} />
                        <span>Delete Account</span>
                    </button>
                )}
            </div>
        </div>
    );
};

