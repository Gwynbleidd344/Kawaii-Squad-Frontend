import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from './store/authStore';
import { Toaster } from "sonner";

// --- IMPORTATION DES PAGES ---
// Assurez-vous que ces fichiers existent dans src/pages/...
import Landing from "./pages/public/Landing";
import Login from "./pages/auth/Login";
import Register from './pages/Register';
import UserDashboard from './pages/user/UserDashboard';
import NewCinApplication from "./pages/user/NewCinApplication";
import AdminDashboard from "./pages/admin/AdminDashboard";
import IdentityDetail from "./pages/admin/IdentityDetail";

// --- COMPOSANTS DE MISE EN PAGE ---
import { SiteHeader, SiteFooter } from "./components/layout/SiteHeader";

/**
 * Layout principal avec Header et Footer
 */
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <SiteHeader />
    <main className="flex-1 bg-gray-50">
      <Outlet />
    </main>
    <SiteFooter />
  </div>
);

/**
 * PROTECTION : Routes réservées aux utilisateurs NON-CONNECTÉS
 * (Empêche un utilisateur connecté d'accéder au Login/Register)
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAuthStore();
  
  if (token && user) {
    // Redirige vers le dashboard approprié selon le rôle
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/cin"} replace />;
  }
  return <>{children}</>;
};

/**
 * PROTECTION : Routes PRIVÉES (Nécessite Token + Rôle spécifique)
 */
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode; 
  allowedRole?: "USER" | "ADMIN" 
}) => {
  const { token, user } = useAuthStore();

  // 1. Si pas de token ou pas d'utilisateur -> Direction Login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si un rôle spécifique est requis et que l'utilisateur ne l'a pas
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/cin"} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================================================
            ROUTES PUBLIQUES
            ========================================================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>

        {/* =========================================================
            ROUTES AUTHENTIFICATION (Public Only)
            ========================================================= */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* =========================================================
            ESPACE UTILISATEUR (Privé - Rôle USER)
            ========================================================= */}
        <Route
          element={
            <ProtectedRoute allowedRole="USER">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/cin" element={<UserDashboard />} />
          <Route path="/cin/new" element={<NewCinApplication />} />
        </Route>

        {/* =========================================================
            ESPACE ADMINISTRATION (Privé - Rôle ADMIN)
            ========================================================= */}
        <Route
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/identities/:id" element={<IdentityDetail />} />
        </Route>

        {/* =========================================================
            REDIRECTION PAR DÉFAUT (404)
            ========================================================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Notifications Globales */}
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}