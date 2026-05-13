import { CheckCircle, XCircle } from 'lucide-react';
import type { ToastItem } from '@/lib/use-toast-stack';

type ToastStackProps = {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
};

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => onDismiss(toast.id)}
          className={`flex min-w-[260px] items-center gap-2 rounded-lg border px-4 py-3 text-left shadow-lg backdrop-blur-sm ${
            toast.variant === 'success'
              ? 'border-green-500/40 bg-green-500/20 text-green-100'
              : 'border-red-500/40 bg-red-500/20 text-red-100'
          }`}
        >
          {toast.variant === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <span className="text-sm">{toast.message}</span>
        </button>
      ))}
    </div>
  );
}
