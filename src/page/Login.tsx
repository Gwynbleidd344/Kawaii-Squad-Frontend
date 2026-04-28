import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authstore';
import { IdentityStatus } from '../types/index';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [statusError, setStatusError] = useState<{
    status: string;
    message: string;
    reason?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setStatusError(null);
    try {
      const response = await login(data);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      // Check if it's a status error (PENDING or REJECTED)
      if (error.response?.status === 403 && error.response?.data?.status) {
        const errorData = error.response.data;
        setStatusError({
          status: errorData.status,
          message: errorData.message,
          reason: errorData.reason,
        });

        if (errorData.status === IdentityStatus.PENDING) {
          toast.error('Your account is pending admin approval. Please check back later.');
        } else if (errorData.status === IdentityStatus.REJECTED) {
          toast.error(`Your account was rejected: ${errorData.reason}`);
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--slate-50)] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--brand-600)] mb-4">
            <span className="text-white text-xl font-bold">K</span>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--slate-900)] tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--slate-500)] mt-1">
            Sign in to your Kawaii Squad account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Status Error Alert */}
            {statusError && (
              <div
                className={`p-3.5 rounded-xl text-sm ${
                  statusError.status === IdentityStatus.PENDING
                    ? 'bg-[var(--warning-bg)] border border-amber-200 text-amber-800'
                    : 'bg-[var(--danger-bg)] border border-red-200 text-red-800'
                }`}
              >
                <p className="font-medium">{statusError.message}</p>
                {statusError.reason && (
                  <p className="text-xs mt-1 opacity-80">{statusError.reason}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--slate-200)] rounded-xl text-[var(--slate-900)] placeholder:text-[var(--slate-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-shadow"
              />
              {errors.email && (
                <span className="text-[var(--danger)] text-xs mt-1 block">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--slate-200)] rounded-xl text-[var(--slate-900)] placeholder:text-[var(--slate-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-shadow"
              />
              {errors.password && (
                <span className="text-[var(--danger)] text-xs mt-1 block">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--brand-600)] text-white font-medium py-2.5 rounded-xl hover:bg-[var(--brand-700)] active:bg-[var(--brand-800)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>

            {/* Register Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-[var(--slate-500)]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-[var(--brand-600)] font-medium hover:text-[var(--brand-700)] transition-colors cursor-pointer"
                >
                  Create one
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
