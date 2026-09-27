import { useContext } from 'react';
import { VersionContext } from '../contexts/VersionContext';
import type { VersionContextType } from '../types/version';

/**
 * Custom React hook to consume app version and PWA update information.
 */
export function useVersion(): VersionContextType {
    const context = useContext(VersionContext);
    if (!context) {
        throw new Error('useVersion must be used within a VersionProvider');
    }
    return context;
}
