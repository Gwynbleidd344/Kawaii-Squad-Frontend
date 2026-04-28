import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { Role } from '../types/index';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  UserPlus,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" />, path: '/dashboard' },
  { label: 'Ma CIN', icon: <CreditCard className="w-[18px] h-[18px]" />, path: '/cin' },
];

const adminItems: NavItem[] = [
  { label: 'Identités', icon: <Users className="w-[18px] h-[18px]" />, path: '/admin', adminOnly: true },
  { label: 'Créer Admin', icon: <UserPlus className="w-[18px] h-[18px]" />, path: '/admin/create', adminOnly: true },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === Role.ADMIN;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname.startsWith('/admin/identities');
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[260px]
          bg-[var(--bg-sidebar)] border-r border-[var(--border-default)]
          flex flex-col
          transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-5 flex-shrink-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate('/dashboard')}>
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="text-[var(--text-primary)] font-semibold text-[15px] tracking-tight">
              DIGITALIZEO
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-hover)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Main nav */}
          <div className="mb-2">
            <p className="px-3 mb-2 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Menu
            </p>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
                  transition-colors cursor-pointer
                  ${
                    isActive(item.path)
                      ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Admin nav */}
          {isAdmin && (
            <div className="pt-2 mt-2 border-t border-[var(--border-subtle)]">
              <p className="px-3 mb-2 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Administration
              </p>
              {adminItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
                    transition-colors cursor-pointer
                    ${
                      isActive(item.path)
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="flex-shrink-0 border-t border-[var(--border-default)] p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-[var(--accent)]">
                {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                {user?.fullName}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg text-[13px] font-medium text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--danger)] transition-colors cursor-pointer"
          >
            <LogOut className="w-[16px] h-[16px]" />
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}
