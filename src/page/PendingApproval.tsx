import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { IdentityStatus } from '../types/index';
import { toast } from 'sonner';
import { Clock, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function PendingApproval() {
  const navigate = useNavigate();
  const { user, fetchUserStatus } = useAuthStore();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or no user
    if (!user) {
      navigate('/register');
    }
  }, [user, navigate]);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const status = await fetchUserStatus();

      if (status === IdentityStatus.CONFIRMED) {
        toast.success('Your identity has been confirmed!');
        navigate('/login');
      } else if (status === IdentityStatus.REJECTED) {
        toast.error('Your identity was rejected. Please register again.');
        navigate('/register');
      }
    } catch (error) {
      toast.error('Failed to check status');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case IdentityStatus.CONFIRMED:
        return {
          icon: <CheckCircle className="w-12 h-12 text-[var(--success)]" />,
          bgClass: 'bg-[var(--success-bg)]',
          title: 'Identity Confirmed',
        };
      case IdentityStatus.REJECTED:
        return {
          icon: <XCircle className="w-12 h-12 text-[var(--danger)]" />,
          bgClass: 'bg-[var(--danger-bg)]',
          title: 'Application Rejected',
        };
      default:
        return {
          icon: <Clock className="w-12 h-12 text-[var(--warning)]" />,
          bgClass: 'bg-[var(--warning-bg)]',
          title: 'Pending Review',
        };
    }
  };

  const config = getStatusConfig(user?.status);

  return (
    <div className="min-h-screen bg-[var(--slate-50)] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 text-center">
          {/* Status icon */}
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${config.bgClass} mb-6`}
          >
            {config.icon}
          </div>

          <h1 className="text-xl font-semibold text-[var(--slate-900)] tracking-tight mb-2">
            {config.title}
          </h1>

          {user?.status === IdentityStatus.PENDING && (
            <>
              <p className="text-sm text-[var(--slate-500)] leading-relaxed mb-2">
                Thank you for registering! Your identity is currently under review by our admins.
                This typically takes 24–48 hours.
              </p>
              <p className="text-xs text-[var(--slate-400)] mb-6">
                A confirmation email will be sent to{' '}
                <span className="font-medium text-[var(--slate-600)]">{user?.email}</span> once
                approved.
              </p>
            </>
          )}

          {user?.status === IdentityStatus.CONFIRMED && (
            <>
              <p className="text-sm text-[var(--slate-500)] mb-2">
                Congratulations! Your identity has been confirmed.
              </p>
              <p className="text-xs text-[var(--slate-400)] mb-6">
                You can now sign in to your account.
              </p>
            </>
          )}

          {user?.status === IdentityStatus.REJECTED && (
            <>
              <p className="text-sm text-[var(--slate-500)] mb-3">
                Unfortunately, your application was rejected.
              </p>
              {user?.rejectionReason && (
                <div className="bg-[var(--danger-bg)] border border-red-200 rounded-xl p-3.5 mb-4 text-left">
                  <p className="text-sm text-red-800">
                    <span className="font-medium">Reason:</span> {user.rejectionReason}
                  </p>
                </div>
              )}
              <p className="text-xs text-[var(--slate-400)] mb-6">
                You can register again with corrected information.
              </p>
            </>
          )}

          <div className="space-y-3">
            <button
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="w-full bg-[var(--brand-600)] text-white font-medium py-2.5 rounded-xl hover:bg-[var(--brand-700)] active:bg-[var(--brand-800)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Checking…
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Check Status
                </>
              )}
            </button>

            {user?.status === IdentityStatus.CONFIRMED && (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[var(--slate-100)] text-[var(--slate-700)] font-medium py-2.5 rounded-xl hover:bg-[var(--slate-200)] transition-colors text-sm cursor-pointer"
              >
                Go to Sign In
              </button>
            )}

            {user?.status === IdentityStatus.REJECTED && (
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-[var(--slate-100)] text-[var(--slate-700)] font-medium py-2.5 rounded-xl hover:bg-[var(--slate-200)] transition-colors text-sm cursor-pointer"
              >
                Register Again
              </button>
            )}

            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--slate-500)] hover:text-[var(--slate-700)] py-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
