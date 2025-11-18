// Toast Hook
import { useState, useCallback } from 'react';

export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Toast) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...props, id };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);

    // Temporary console output
    console.log(`[Toast ${props.variant || 'default'}] ${props.title}: ${props.description}`);
  }, []);

  return {
    toast,
    toasts,
    dismiss: (toastId: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    },
  };
}
