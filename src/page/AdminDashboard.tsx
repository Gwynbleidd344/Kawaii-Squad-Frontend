import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { useAuthStore } from '../store/authstore';
import { IdentityStatus } from '../types/index';
import type { UserPublic } from '../types/index';
import { toast } from 'sonner';
import {
  LogOut,
  Shield,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  UserPlus,
} from 'lucide-react';

const STATUS_TABS: { label: string; value: IdentityStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Pending', value: IdentityStatus.PENDING },
  { label: 'Confirmed', value: IdentityStatus.CONFIRMED },
  { label: 'Rejected', value: IdentityStatus.REJECTED },
];

function getStatusBadge(status: IdentityStatus) {
  const map: Record<string, string> = {
    [IdentityStatus.CONFIRMED]:
      'bg-[var(--success-bg)] text-[var(--success)] border border-emerald-200',
    [IdentityStatus.PENDING]:
      'bg-[var(--warning-bg)] text-[var(--warning)] border border-amber-200',
    [IdentityStatus.REJECTED]:
      'bg-[var(--danger-bg)] text-[var(--danger)] border border-red-200',
  };
  return map[status] || '';
}

function getStatusIcon(status: IdentityStatus) {
  switch (status) {
    case IdentityStatus.CONFIRMED:
      return <CheckCircle className="w-3.5 h-3.5" />;
    case IdentityStatus.PENDING:
      return <Clock className="w-3.5 h-3.5" />;
    case IdentityStatus.REJECTED:
      return <XCircle className="w-3.5 h-3.5" />;
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const {
    identities,
    pagination,
    statusFilter,
    isLoading,
    setStatusFilter,
    fetchAllIdentities,
    fetchPendingIdentities,
  } = useAdminStore();

  const [page, setPage] = useState(1);

  useEffect(() => {
    loadIdentities();
  }, [statusFilter, page]);

  const loadIdentities = async () => {
    try {
      if (statusFilter === IdentityStatus.PENDING) {
        await fetchPendingIdentities(page, 20);
      } else {
        await fetchAllIdentities(page, 20);
      }
    } catch {
      toast.error('Failed to load identities');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  const handleFilter = (val: IdentityStatus | undefined) => {
    setStatusFilter(val);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--slate-50)]">
      {/* Top nav */}
      <header className="bg-white border-b border-[var(--slate-200)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-600)] flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="text-[var(--slate-900)] font-semibold text-lg tracking-tight">
              Kawaii Squad
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--brand-50)] text-[var(--brand-600)] border border-[var(--brand-200)]">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/create')}
              className="flex items-center gap-2 text-sm font-medium text-[var(--brand-600)] px-3 py-2 rounded-lg hover:bg-[var(--brand-50)] transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              New Admin
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium text-[var(--slate-500)] px-3 py-2 rounded-lg hover:bg-[var(--slate-100)] transition-colors cursor-pointer"
            >
              My Profile
            </button>
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

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--slate-900)] tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-[var(--slate-400)]" />
              Identity Management
            </h1>
            <p className="text-sm text-[var(--slate-500)] mt-1">
              Review and manage user identity submissions
            </p>
          </div>
          {pagination && (
            <p className="text-sm text-[var(--slate-400)]">
              {pagination.total} total {pagination.total === 1 ? 'identity' : 'identities'}
            </p>
          )}
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1 mb-6 bg-[var(--slate-100)] rounded-xl p-1 w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                statusFilter === tab.value
                  ? 'bg-white text-[var(--slate-900)] shadow-sm'
                  : 'text-[var(--slate-500)] hover:text-[var(--slate-700)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          {isLoading && identities.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-[3px] border-[var(--slate-200)] border-t-[var(--brand-600)] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-[var(--slate-500)]">Loading identities…</p>
            </div>
          ) : identities.length === 0 ? (
            <div className="p-16 text-center">
              <Search className="w-10 h-10 text-[var(--slate-300)] mx-auto mb-3" />
              <p className="text-sm text-[var(--slate-500)]">No identities found</p>
              <p className="text-xs text-[var(--slate-400)] mt-1">
                {statusFilter ? 'Try a different filter' : 'No users have registered yet'}
              </p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr_140px_140px_80px] gap-4 px-6 py-3 border-b border-[var(--slate-100)] bg-[var(--slate-50)]">
                <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider">
                  User
                </p>
                <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider">
                  Email
                </p>
                <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider">
                  Status
                </p>
                <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider">
                  Registered
                </p>
                <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider text-right">
                  Action
                </p>
              </div>

              {/* Table rows */}
              {identities.map((identity) => (
                <IdentityRow
                  key={identity.id}
                  identity={identity}
                  onView={() => navigate(`/admin/identities/${identity.id}`)}
                />
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-[var(--slate-500)]">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--slate-600)] bg-white border border-[var(--slate-200)] rounded-lg hover:bg-[var(--slate-50)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--slate-600)] bg-white border border-[var(--slate-200)] rounded-lg hover:bg-[var(--slate-50)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Row component ────────────────────────────────────────────────────────── */

function IdentityRow({
  identity,
  onView,
}: {
  identity: UserPublic;
  onView: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_140px_140px_80px] gap-4 px-6 py-4 border-b border-[var(--slate-50)] hover:bg-[var(--slate-50)] transition-colors items-center">
      <div className="flex items-center gap-3 min-w-0">
        {identity.idPhotoUrl ? (
          <img
            src={identity.idPhotoUrl}
            alt=""
            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded-lg bg-[var(--brand-50)] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-[var(--brand-500)]">
              {identity.fullName.charAt(0)}
            </span>
          </div>
        )}
        <span className="text-sm font-medium text-[var(--slate-900)] truncate">
          {identity.fullName}
        </span>
      </div>

      <span className="text-sm text-[var(--slate-500)] truncate">{identity.email}</span>

      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium w-fit ${getStatusBadge(identity.status)}`}
      >
        {getStatusIcon(identity.status)}
        {identity.status}
      </span>

      <span className="text-xs text-[var(--slate-400)]">
        {new Date(identity.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>

      <div className="text-right">
        <button
          onClick={onView}
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
      </div>
    </div>
  );
}
