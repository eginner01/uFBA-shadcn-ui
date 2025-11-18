import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function PageContainer({ 
  children, 
  className,
  title,
  description,
  actions 
}: PageContainerProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {(title || description || actions) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-muted-foreground text-sm mt-1">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
