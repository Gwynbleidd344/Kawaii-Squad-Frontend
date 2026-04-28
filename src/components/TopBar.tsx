import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  onMenuClick: () => void;
}

export function TopBar({ title, subtitle, icon, actions, onMenuClick }: TopBarProps) {
  return (
    <header className="h-16 flex items-center justify-between px-6 lg:px-8 border-b border-[var(--border-default)] bg-[var(--bg-surface)] flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-hover)] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <span className="text-[var(--text-muted)] flex-shrink-0">{icon}</span>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[var(--text-muted)] truncate -mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </header>
  );
}
