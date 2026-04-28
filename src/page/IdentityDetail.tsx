import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { IdentityStatus } from '../types/index';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Mail,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  User,
  AlertTriangle,
} from 'lucide-react';

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
      return <CheckCircle className="w-4 h-4" />;
    case IdentityStatus.PENDING:
      return <Clock className="w-4 h-4" />;
    case IdentityStatus.REJECTED:
      return <XCircle className="w-4 h-4" />;
  }
}

export default function IdentityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedIdentity, isLoading, fetchIdentityDetail, approveIdentity, rejectIdentity } =
    useAdminStore();
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchIdentityDetail(id).catch(() => {
        toast.error('Failed to load identity');
        navigate('/admin');
      });
    }
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await approveIdentity(id);
      toast.success('Identity approved successfully');
    } catch {
      toast.error('Failed to approve identity');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!id || !rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setActionLoading(true);
    try {
      await rejectIdentity(id, rejectReason.trim());
      toast.success('Identity rejected');
      setShowRejectForm(false);
      setRejectReason('');
    } catch {
      toast.error('Failed to reject identity');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading && !selectedIdentity) {
    return (
      <div className="min-h-screen bg-[var(--slate-50)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-[3px] border-[var(--slate-200)] border-t-[var(--brand-600)] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[var(--slate-500)]">Loading identity…</p>
        </div>
      </div>
    );
  }

  if (!selectedIdentity) {
    return (
      <div className="min-h-screen bg-[var(--slate-50)] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-[var(--slate-300)] mx-auto mb-3" />
          <p className="text-sm text-[var(--slate-500)]">Identity not found</p>
          <button
            onClick={() => navigate('/admin')}
            className="mt-4 text-sm font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)] cursor-pointer"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const identity = selectedIdentity;

  return (
    <div className="min-h-screen bg-[var(--slate-50)]">
      {/* Top nav */}
      <header className="bg-white border-b border-[var(--slate-200)]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-sm font-medium text-[var(--slate-500)] hover:text-[var(--slate-700)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to identities
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Photo & quick info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Photo card */}
            <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <div className="flex flex-col items-center text-center">
                {identity.idPhotoUrl ? (
                  <img
                    src={identity.idPhotoUrl}
                    alt="ID Photo"
                    className="w-full max-w-[200px] rounded-2xl object-cover border-2 border-[var(--slate-100)] mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-[var(--brand-50)] flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-[var(--brand-400)]" />
                  </div>
                )}
                <h2 className="text-lg font-semibold text-[var(--slate-900)]">{identity.fullName}</h2>
                <p className="text-sm text-[var(--slate-500)] mt-0.5">{identity.email}</p>

                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${getStatusBadge(identity.status)}`}
                  >
                    {getStatusIcon(identity.status)}
                    {identity.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions card */}
            {identity.status === IdentityStatus.PENDING && (
              <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-3">
                <h3 className="text-sm font-semibold text-[var(--slate-900)] mb-3">Actions</h3>

                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--success)] text-white font-medium py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>

                {!showRejectForm ? (
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white text-[var(--danger)] font-medium py-2.5 rounded-xl border border-red-200 hover:bg-[var(--danger-bg)] transition-all text-sm cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Provide a reason for rejection…"
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--slate-200)] rounded-xl text-[var(--slate-900)] placeholder:text-[var(--slate-400)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)] focus:border-transparent resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleReject}
                        disabled={actionLoading || !rejectReason.trim()}
                        className="flex-1 bg-[var(--danger)] text-white font-medium py-2 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm cursor-pointer"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectReason('');
                        }}
                        className="px-4 py-2 text-sm font-medium text-[var(--slate-500)] bg-[var(--slate-100)] rounded-xl hover:bg-[var(--slate-200)] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal info */}
            <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <h3 className="text-base font-semibold text-[var(--slate-900)] mb-5">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <InfoField label="Full Name" value={identity.fullName} />
                <InfoField label="Father's Name" value={identity.fatherName} />
                <InfoField label="Mother's Name" value={identity.motherName} />
                <InfoField
                  label="Date of Birth"
                  value={new Date(identity.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  icon={<Calendar className="w-3.5 h-3.5" />}
                />
                <InfoField
                  label="Place of Birth"
                  value={identity.placeOfBirth}
                  icon={<MapPin className="w-3.5 h-3.5" />}
                />
                <InfoField
                  label="Email"
                  value={identity.email}
                  icon={<Mail className="w-3.5 h-3.5" />}
                />
              </div>
            </div>

            {/* Status info */}
            <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <h3 className="text-base font-semibold text-[var(--slate-900)] mb-5">
                Account Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--slate-500)]">Status</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusBadge(identity.status)}`}
                  >
                    {getStatusIcon(identity.status)}
                    {identity.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--slate-500)]">Role</span>
                  <span className="text-sm font-medium text-[var(--slate-900)] flex items-center gap-1">
                    {identity.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-[var(--brand-500)]" />}
                    {identity.role}
                  </span>
                </div>

                {identity.rejectionReason && (
                  <div className="bg-[var(--danger-bg)] border border-red-200 rounded-xl p-3.5 mt-2">
                    <p className="text-sm text-red-800">
                      <span className="font-medium">Rejection Reason:</span> {identity.rejectionReason}
                    </p>
                  </div>
                )}

                <div className="border-t border-[var(--slate-100)] pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1">
                      Created
                    </p>
                    <p className="text-sm text-[var(--slate-700)]">
                      {new Date(identity.createdAt).toLocaleDateString('en-US', {
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
                      Updated
                    </p>
                    <p className="text-sm text-[var(--slate-700)]">
                      {new Date(identity.updatedAt).toLocaleDateString('en-US', {
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

/* ─── Info field component ─────────────────────────────────────────────────── */

function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-sm text-[var(--slate-900)] font-medium">{value}</p>
    </div>
  );
}
