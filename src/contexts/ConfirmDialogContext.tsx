import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmDialogOptions {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'success' | 'error';
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmDialogContextType {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  alert: (title: string, description: string, type?: 'info' | 'success' | 'error') => Promise<void>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within ConfirmDialogProvider');
  }
  return context;
};

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({
    title: '确认操作',
    description: '',
    confirmText: '确定',
    cancelText: '取消',
    type: 'warning',
  });
  const [resolveCallback, setResolveCallback] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        title: opts.title || '确认操作',
        description: opts.description,
        confirmText: opts.confirmText || '确定',
        cancelText: opts.cancelText || '取消',
        type: opts.type || 'warning',
        onConfirm: opts.onConfirm,
        onCancel: opts.onCancel,
      });
      setResolveCallback(() => resolve);
      setOpen(true);
    });
  }, []);

  const alert = useCallback((title: string, description: string, type: 'info' | 'success' | 'error' = 'info'): Promise<void> => {
    return new Promise((resolve) => {
      setOptions({
        title,
        description,
        confirmText: '确定',
        cancelText: '',
        type,
      });
      setResolveCallback(() => () => {
        resolve();
        return true;
      });
      setOpen(true);
    });
  }, []);

  const handleConfirm = async () => {
    if (options.onConfirm) {
      await options.onConfirm();
    }
    if (resolveCallback) {
      resolveCallback(true);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    if (options.onCancel) {
      options.onCancel();
    }
    if (resolveCallback) {
      resolveCallback(false);
    }
    setOpen(false);
  };

  const getIcon = () => {
    switch (options.type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-destructive" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getIconBgColor = () => {
    switch (options.type) {
      case 'warning':
        return 'bg-yellow-500/10';
      case 'error':
        return 'bg-destructive/10';
      case 'success':
        return 'bg-green-500/10';
      case 'info':
      default:
        return 'bg-blue-500/10';
    }
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm, alert }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${getIconBgColor()}`}>
                {getIcon()}
              </div>
              <AlertDialogTitle className="text-foreground">{options.title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground mt-4">
              {options.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {options.cancelText && (
              <AlertDialogCancel 
                onClick={handleCancel}
                className="border-border text-sm"
              >
                {options.cancelText}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={handleConfirm}
              className={`text-sm ${
                options.type === 'error' 
                  ? 'bg-destructive hover:bg-destructive/90' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {options.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDialogContext.Provider>
  );
};
