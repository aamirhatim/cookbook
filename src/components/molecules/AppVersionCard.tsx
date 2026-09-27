import React from 'react';
import {
    IconVersions,
    IconRefresh,
    IconCheck,
    IconDeviceMobile,
    IconWorld,
    IconSparkles,
} from '@tabler/icons-react';
import { Button } from '../atoms/Button';
import { useVersion } from '../../hooks/useVersion';

export const AppVersionCard: React.FC = () => {
    const {
        currentVersion,
        isChecking,
        isUpdateAvailable,
        isStandalone,
        checkForUpdates,
    } = useVersion();

    const handleCheckClick = () => {
        checkForUpdates(false);
    };

    return (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <IconVersions className="w-5 h-5" stroke={1.5} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-foreground">
                            Application Version
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Automated PWA updates & version verification
                        </p>
                    </div>
                </div>

                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary text-tertiary-foreground border border-border shrink-0">
                    v{currentVersion}
                </span>
            </div>

            {/* Badges / Status details */}
            <div className="grid grid-cols-2 gap-3">
                {/* Platform Mode */}
                <div className="p-3 rounded-xl bg-surface border border-border flex items-center space-x-2.5 min-w-0">
                    {isStandalone ? (
                        <IconDeviceMobile className="w-4 h-4 text-primary shrink-0" stroke={1.5} />
                    ) : (
                        <IconWorld className="w-4 h-4 text-muted-foreground shrink-0" stroke={1.5} />
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Mode</p>
                        <p className="text-xs font-semibold text-foreground truncate">
                            {isStandalone ? 'Installed PWA' : 'Web Browser'}
                        </p>
                    </div>
                </div>

                {/* Update Status */}
                <div className="p-3 rounded-xl bg-surface border border-border flex items-center space-x-2.5 min-w-0">
                    {isUpdateAvailable ? (
                        <IconSparkles className="w-4 h-4 text-primary shrink-0" stroke={1.5} />
                    ) : (
                        <IconCheck className="w-4 h-4 text-green-fg shrink-0" stroke={1.5} />
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Status</p>
                        <p className="text-xs font-semibold text-foreground truncate">
                            {isUpdateAvailable ? 'Update Ready' : 'Up to date'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 border-t border-border">
                <Button
                    icon={IconRefresh}
                    text={isChecking ? 'Checking for updates...' : 'Check for Updates'}
                    width="full"
                    variant="subtle"
                    loading={isChecking}
                    disabled={isChecking}
                    onClick={handleCheckClick}
                />
            </div>
        </div>
    );
};
