import type { ReactNode } from 'react';

interface InfoFieldProps {
  label: string;
  value: string;
  icon?: ReactNode;
  mono?: boolean;
}

export function InfoField({ label, value, icon, mono = false }: InfoFieldProps) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className={`text-sm text-[var(--text-primary)] font-medium ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  );
}
