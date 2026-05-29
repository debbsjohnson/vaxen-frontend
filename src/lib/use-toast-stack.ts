import { useCallback, useState } from 'react';

export type ToastVariant = 'success' | 'error';

export type ToastItem = {
  id: number;
  variant: ToastVariant;
  message: string;
};

export function useToastStack() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((variant: ToastVariant, message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, variant, message }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
}
