import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';

let toastCount = 0;

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'destructive';
}

type ToastInput = Omit<Toast, 'id'>;

const listeners: Array<(toasts: Toast[]) => void> = [];
let memoryState: Toast[] = [];

function notify() {
  listeners.forEach((listener) => listener(memoryState));
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memoryState);

  useState(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  });

  const toast = useCallback((props: ToastInput) => {
    const id = `toast-${++toastCount}`;
    const newToast: Toast = { ...props, id };
    
    memoryState = [...memoryState, newToast];
    notify();

    // 自动移除 toast
    setTimeout(() => {
      memoryState = memoryState.filter((t) => t.id !== id);
      notify();
    }, 5000);

    return id;
  }, []);

  const dismiss = useCallback((toastId: string) => {
    memoryState = memoryState.filter((t) => t.id !== toastId);
    notify();
  }, []);

  return { toast, toasts, dismiss };
}
