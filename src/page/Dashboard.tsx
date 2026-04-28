import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { IdentityStatus, Role } from '../types/index';
import { LogOut, User, Calendar, MapPin, Mail, Shield, RefreshCw, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, fetchCurrentUser } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleRefreshProfile = async () => {
    try {
      await fetchCurrentUser();
      toast.success('Profile refreshed');
    } catch (error) {
      toast.error('Failed to refresh profile');
    }
  };

  const getStatusBadge = (status: IdentityStatus) => {
    const badges: Record<string, string> = {
      [IdentityStatus.CONFIRMED]:
        'bg-[var(--success-bg)] text-[var(--success)] border border-emerald-200',
      [IdentityStatus.PENDING]:
        'bg-[var(--warning-bg)] text-[var(--warning)] border border-amber-200',
      [IdentityStatus.REJECTED]:
        'bg-[var(--danger-bg)] text-[var(--danger)] border border-red-200',
    };
    return badges[status] || '';
  };

  const getStatusLabel = (status: IdentityStatus) => {
    const labels: Record<string, string> = {
      [IdentityStatus.CONFIRMED]: 'Confirmed',
      [IdentityStatus.PENDING]: 'Pending Review',
      [IdentityStatus.REJECTED]: 'Rejected',
    };
    return labels[status] || status;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--slate-50)]">
      {/* Top navigation */}
      <header className="bg-white border-b border-[var(--slate-200)]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-600)] flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="text-[var(--slate-900)] font-semibold text-lg tracking-tight">
              Kawaii Squad
            </span>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === Role.ADMIN && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-sm font-medium text-[var(--brand-600)] px-3 py-2 rounded-lg hover:bg-[var(--brand-50)] transition-colors cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-[var(--slate-500)] hover:text-[var(--slate-700)] transition-colors px-3 py-2 rounded-lg hover:bg-[var(--slate-100)] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[var(--slate-900)] tracking-tight">
            Profile
          </h1>
          <p className="text-sm text-[var(--slate-500)] mt-1">
            Manage your identity and account details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — Profile summary card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <div className="flex flex-col items-center text-center">
                {user.idPhotoUrl ? (
                  <img
                    src={user.idPhotoUrl}
                    alt="ID Photo"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[var(--slate-100)] mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[var(--brand-50)] flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-[var(--brand-400)]" />
                  </div>
                )}

                <h2 className="text-lg font-semibold text-[var(--slate-900)]">
                  {user.fullName}
                </h2>
                <p className="text-sm text-[var(--slate-500)] mt-0.5">{user.email}</p>

                <div className="flex items-center gap-2 mt-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusBadge(user.status)}`}
                  >
                    {getStatusLabel(user.status)}
                  </span>
                  {user.role === Role.ADMIN && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--brand-50)] text-[var(--brand-600)] border border-[var(--brand-200)]">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--slate-100)] space-y-2">
                <button
                  onClick={handleRefreshProfile}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-[var(--brand-600)] bg-[var(--brand-50)] hover:bg-[var(--brand-100)] py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Profile
                </button>
                <button
                  onClick={() => navigate('/cin')}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-[var(--slate-600)] bg-[var(--slate-100)] hover:bg-[var(--slate-200)] py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  My CIN
                </button>
              </div>
            </div>
          </div>

          {/* Right column — Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <h3 className="text-base font-semibold text-[var(--slate-900)] mb-5">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1">
                    Full Name
                  </p>
                  <p className="text-sm text-[var(--slate-900)] font-medium">{user.fullName}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1">
                    Father's Name
                  </p>
                  <p className="text-sm text-[var(--slate-900)] font-medium">{user.fatherName}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1">
                    Mother's Name
                  </p>
                  <p className="text-sm text-[var(--slate-900)] font-medium">{user.motherName}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Date of Birth
                  </p>
                  <p className="text-sm text-[var(--slate-900)] font-medium">
                    {new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Place of Birth
                  </p>
                  <p className="text-sm text-[var(--slate-900)] font-medium">{user.placeOfBirth}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </p>
                  <p className="text-sm text-[var(--slate-900)] font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <h3 className="text-base font-semibold text-[var(--slate-900)] mb-5">
                Account Status
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--slate-500)]">Current Status</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusBadge(user.status)}`}
                  >
                    {getStatusLabel(user.status)}
                  </span>
                </div>

                {user.rejectionReason && (
                  <div className="bg-[var(--danger-bg)] border border-red-200 rounded-xl p-3.5">
                    <p className="text-sm text-red-800">
                      <span className="font-medium">Rejection Reason:</span> {user.rejectionReason}
                    </p>
                  </div>
                )}

                <div className="border-t border-[var(--slate-100)] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1">
                      Created
                    </p>
                    <p className="text-sm text-[var(--slate-700)]">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm text-[var(--slate-700)]">
                      {new Date(user.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
