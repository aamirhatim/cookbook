export interface AppVersionInfo {
    version: string;
    buildTime?: number;
}

export interface VersionContextType {
    currentVersion: string;
    latestVersion: string | null;
    isChecking: boolean;
    isUpdateAvailable: boolean;
    isOfflineReady: boolean;
    isStandalone: boolean;
    lastChecked: number | null;
    checkForUpdates: (silent?: boolean) => Promise<boolean>;
    applyUpdate: () => void;
}
