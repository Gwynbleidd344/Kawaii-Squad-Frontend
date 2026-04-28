import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCinStore } from '../store/cinStore';
import { useAuthStore } from '../store/authstore';
import { Role } from '../types/index';
import { toast } from 'sonner';
import {
  LogOut,
  Shield,
  Upload,
  CreditCard,
  Calendar,
  MapPin,
  Mail,
  User,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

export default function MyCin() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { cin, isLoading, hasFetched, fetchCin, createCin } = useCinStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
      fetchCin();
    }
  }, [hasFetched, fetchCin]);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, or WebP images are accepted');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5 MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!selectedFile) {
      toast.error('Please select a CIN photo first');
      return;
    }
    setIsUploading(true);
    try {
      await createCin(selectedFile);
      toast.success('CIN created successfully!');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      if (error?.status === 409) {
        toast.info('A CIN already exists for your account');
      } else {
        toast.error(error?.message || 'Failed to create CIN');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Loading state
  if (isLoading && !hasFetched) {
    return (
      <div className="min-h-screen bg-[var(--slate-50)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-[3px] border-[var(--slate-200)] border-t-[var(--brand-600)] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[var(--slate-500)]">Loading CIN…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--slate-50)]">
      {/* Top nav */}
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
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-sm font-medium text-[var(--slate-500)] px-3 py-2 rounded-lg hover:bg-[var(--slate-100)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Profile
            </button>
            {user?.role === Role.ADMIN && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-sm font-medium text-[var(--brand-600)] px-3 py-2 rounded-lg hover:bg-[var(--brand-50)] transition-colors cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                Admin
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

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[var(--slate-900)] tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[var(--slate-400)]" />
            Carte d'Identité Nationale
          </h1>
          <p className="text-sm text-[var(--slate-500)] mt-1">
            Your official digital identity card
          </p>
        </div>

        {cin ? (
          /* ─── CIN EXISTS — display it ──────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — CIN card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                {cin.cinPhotoUrl && (
                  <img
                    src={cin.cinPhotoUrl}
                    alt="CIN Photo"
                    className="w-full aspect-[3/2] object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                    <span className="text-xs font-medium text-[var(--success)]">Active CIN</span>
                  </div>
                  <p className="text-xs text-[var(--slate-400)]">
                    ID: <span className="font-mono text-[var(--slate-600)]">{cin.cinId}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Owner info */}
              <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                <h3 className="text-base font-semibold text-[var(--slate-900)] mb-5">
                  Cardholder Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  <InfoField label="Full Name" value={cin.owner.fullName} />
                  <InfoField label="Father's Name" value={cin.owner.fatherName} />
                  <InfoField label="Mother's Name" value={cin.owner.motherName} />
                  <InfoField
                    label="Date of Birth"
                    value={new Date(cin.owner.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    icon={<Calendar className="w-3.5 h-3.5" />}
                  />
                  <InfoField
                    label="Place of Birth"
                    value={cin.owner.placeOfBirth}
                    icon={<MapPin className="w-3.5 h-3.5" />}
                  />
                  <InfoField
                    label="Email"
                    value={cin.owner.email}
                    icon={<Mail className="w-3.5 h-3.5" />}
                  />
                </div>
              </div>

              {/* Meta info */}
              <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                <h3 className="text-base font-semibold text-[var(--slate-900)] mb-5">
                  Card Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  <div>
                    <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1">
                      CIN ID
                    </p>
                    <p className="text-sm text-[var(--slate-900)] font-mono">{cin.cinId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--success-bg)] text-[var(--success)] border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      CONFIRMED
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--slate-400)] uppercase tracking-wider mb-1">
                      Issued
                    </p>
                    <p className="text-sm text-[var(--slate-700)]">
                      {new Date(cin.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
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
                      {new Date(cin.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
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
        ) : (
          /* ─── NO CIN — create form ────────────────────────────────────────── */
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-50)] mb-5">
                <CreditCard className="w-8 h-8 text-[var(--brand-400)]" />
              </div>

              <h2 className="text-lg font-semibold text-[var(--slate-900)] mb-2">
                Create Your CIN
              </h2>
              <p className="text-sm text-[var(--slate-500)] mb-6">
                Upload a photo to generate your Carte d'Identité Nationale
              </p>

              {/* Upload zone */}
              <div
                className="relative border-2 border-dashed border-[var(--slate-200)] rounded-xl p-8 hover:border-[var(--brand-400)] transition-colors cursor-pointer mb-6"
                onClick={() => document.getElementById('cin-photo-input')?.click()}
              >
                <input
                  id="cin-photo-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="CIN Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Change photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-10 h-10 text-[var(--slate-300)]" />
                    <div>
                      <p className="text-sm font-medium text-[var(--slate-600)]">
                        Click to upload CIN photo
                      </p>
                      <p className="text-xs text-[var(--slate-400)] mt-1">
                        JPEG, PNG, or WebP — max 5 MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleCreate}
                disabled={!selectedFile || isUploading}
                className="w-full bg-[var(--brand-600)] text-white font-medium py-2.5 rounded-xl hover:bg-[var(--brand-700)] active:bg-[var(--brand-800)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
              >
                {isUploading ? 'Creating CIN…' : 'Create CIN'}
              </button>
            </div>
          </div>
        )}
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
