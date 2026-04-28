import { createContext, useContext, useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppLayoutContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const AppLayoutContext = createContext<AppLayoutContextValue>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
});

export function useAppLayout() {
  return useContext(AppLayoutContext);
}

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <AppLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </AppLayoutContext.Provider>
  );
}
