import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAdminStore } from '../store/adminStore';
import { ArrowLeft, Shield } from 'lucide-react';

const createAdminSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').min(3, 'Min 3 characters'),
  fatherName: z.string().min(1, "Father's name is required").min(3, 'Min 3 characters'),
  motherName: z.string().min(1, "Mother's name is required").min(3, 'Min 3 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'At least 1 uppercase letter')
    .regex(/[0-9]/, 'At least 1 number'),
  adminSecret: z.string().optional(),
});

type CreateAdminFormData = z.infer<typeof createAdminSchema>;

export default function CreateAdmin() {
  const navigate = useNavigate();
  const { createAdmin, isLoading } = useAdminStore();
  const [useSecret, setUseSecret] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
  });

  const onSubmit = async (data: CreateAdminFormData) => {
    try {
      const { adminSecret, ...adminData } = data;
      await createAdmin(adminData, useSecret ? adminSecret : undefined);
      toast.success('Admin account created successfully');
      navigate('/admin');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to create admin';
      toast.error(msg);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--slate-200)] rounded-xl text-[var(--slate-900)] placeholder:text-[var(--slate-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-shadow';

  return (
    <div className="min-h-screen bg-[var(--slate-50)]">
      {/* Top nav */}
      <header className="bg-white border-b border-[var(--slate-200)]">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-sm font-medium text-[var(--slate-500)] hover:text-[var(--slate-700)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--brand-600)] mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--slate-900)] tracking-tight">
            Create Admin Account
          </h1>
          <p className="text-sm text-[var(--slate-500)] mt-1">
            Create a new administrator with full management access
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8">
          {/* Auth method toggle */}
          <div className="mb-6 p-3 bg-[var(--slate-50)] rounded-xl">
            <p className="text-xs font-medium text-[var(--slate-500)] mb-2">Authentication Method</p>
            <div className="flex gap-1 bg-[var(--slate-100)] rounded-lg p-1">
              <button
                type="button"
                onClick={() => setUseSecret(false)}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  !useSecret
                    ? 'bg-white text-[var(--slate-900)] shadow-sm'
                    : 'text-[var(--slate-500)]'
                }`}
              >
                Bearer Token (JWT)
              </button>
              <button
                type="button"
                onClick={() => setUseSecret(true)}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  useSecret
                    ? 'bg-white text-[var(--slate-900)] shadow-sm'
                    : 'text-[var(--slate-500)]'
                }`}
              >
                Master Secret
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Admin Secret */}
            {useSecret && (
              <div>
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Admin Master Secret
                </label>
                <input
                  type="password"
                  placeholder="x-admin-secret"
                  {...register('adminSecret')}
                  className={inputClass}
                />
                <p className="text-xs text-[var(--slate-400)] mt-1.5">
                  Required for bootstrapping the first admin account
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Full Name
                </label>
                <input type="text" placeholder="Admin User" {...register('fullName')} className={inputClass} />
                {errors.fullName && (
                  <span className="text-[var(--danger)] text-xs mt-1 block">{errors.fullName.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Father's Name
                </label>
                <input type="text" placeholder="John" {...register('fatherName')} className={inputClass} />
                {errors.fatherName && (
                  <span className="text-[var(--danger)] text-xs mt-1 block">{errors.fatherName.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Mother's Name
                </label>
                <input type="text" placeholder="Mary" {...register('motherName')} className={inputClass} />
                {errors.motherName && (
                  <span className="text-[var(--danger)] text-xs mt-1 block">{errors.motherName.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Date of Birth
                </label>
                <input type="date" {...register('dateOfBirth')} className={inputClass} />
                {errors.dateOfBirth && (
                  <span className="text-[var(--danger)] text-xs mt-1 block">{errors.dateOfBirth.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Place of Birth
                </label>
                <input type="text" placeholder="City" {...register('placeOfBirth')} className={inputClass} />
                {errors.placeOfBirth && (
                  <span className="text-[var(--danger)] text-xs mt-1 block">{errors.placeOfBirth.message}</span>
                )}
              </div>
            </div>

            <div className="border-t border-[var(--slate-100)]" />

            <div>
              <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">Email</label>
              <input type="email" placeholder="admin@example.com" {...register('email')} className={inputClass} />
              {errors.email && (
                <span className="text-[var(--danger)] text-xs mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" {...register('password')} className={inputClass} />
              {errors.password && (
                <span className="text-[var(--danger)] text-xs mt-1 block">{errors.password.message}</span>
              )}
              <p className="text-xs text-[var(--slate-400)] mt-1.5">
                Min 8 characters, 1 uppercase, 1 number
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--brand-600)] text-white font-medium py-2.5 rounded-xl hover:bg-[var(--brand-700)] active:bg-[var(--brand-800)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
            >
              {isLoading ? 'Creating…' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
