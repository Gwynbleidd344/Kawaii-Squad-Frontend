import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authstore';
import { AuthLayout } from './components/AuthLayout';
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import PendingApproval from './page/PendingApproval';
import AdminDashboard from './page/AdminDashboard';
import IdentityDetail from './page/IdentityDetail';
import CreateAdmin from './page/CreateAdmin';
import MyCin from './page/MyCin';

function App() {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            borderRadius: '8px',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pending-approval" element={<PendingApproval />} />

        {/* Protected Routes — confirmed users */}
        <Route element={<AuthLayout requireConfirmed={true} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cin" element={<MyCin />} />
        </Route>

        {/* Protected Routes — admin only */}
        <Route element={<AuthLayout requireConfirmed={true} requireAdmin={true} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/identities/:id" element={<IdentityDetail />} />
          <Route path="/admin/create" element={<CreateAdmin />} />
        </Route>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
