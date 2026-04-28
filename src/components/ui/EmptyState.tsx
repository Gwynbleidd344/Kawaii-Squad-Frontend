import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <div className="flex justify-center mb-4 text-[var(--text-muted)]">
        {icon}
      </div>
      <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{title}</p>
      {description && (
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
