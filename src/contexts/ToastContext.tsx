import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { ToastItem, ToastType } from '../components/molecules/ToastItem';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => string;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    // Clear any existing timer
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev.slice(-2), newToast]); // Keep at most 3 toasts on screen

      if (duration > 0) {
        const timeout = setTimeout(() => {
          dismissToast(id);
        }, duration);
        timeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    [dismissToast]
  );

  // Clean up all timers on unmount
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timer) => clearTimeout(timer));
      timeouts.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Global Fixed Toast Viewport at Top */}
      <div
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={dismissToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
