import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-[var(--success-bg)] text-[var(--success)] border-[var(--success-border)]',
  warning: 'bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning-border)]',
  danger: 'bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger-border)]',
  info: 'bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-muted)]',
  neutral: 'bg-[var(--bg-hover)] text-[var(--text-secondary)] border-[var(--border-default)]',
};

export function Badge({ children, variant = 'neutral', icon, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
