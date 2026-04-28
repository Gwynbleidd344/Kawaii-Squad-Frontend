import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authstore';
import type { RegisterRequest } from '../types/index';
import { Upload } from 'lucide-react';

// Validation schema
const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').min(3, 'Name must be at least 3 characters'),
  fatherName: z.string().min(1, "Father's name is required").min(3, 'Name must be at least 3 characters'),
  motherName: z.string().min(1, "Mother's name is required").min(3, 'Name must be at least 3 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  idPhoto: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5 MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, or WebP formats are allowed'
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const idPhotoFile = watch('idPhoto');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerData: RegisterRequest = {
        fullName: data.fullName,
        fatherName: data.fatherName,
        motherName: data.motherName,
        dateOfBirth: data.dateOfBirth,
        placeOfBirth: data.placeOfBirth,
        email: data.email,
        password: data.password,
        idPhoto: data.idPhoto,
      };

      await registerUser(registerData);
      toast.success('Registration successful! Please wait for admin approval.');
      navigate('/pending-approval');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage);
    }
  };

  const handleIdPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('idPhoto', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[var(--slate-50)] border border-[var(--slate-200)] rounded-xl text-[var(--slate-900)] placeholder:text-[var(--slate-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-shadow';

  return (
    <div className="min-h-screen bg-[var(--slate-50)] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[460px]">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--brand-600)] mb-4">
            <span className="text-white text-xl font-bold">K</span>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--slate-900)] tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-[var(--slate-500)] mt-1">
            Set up your digital identity on Kawaii Squad
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Two-column grid for names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  {...register('fullName')}
                  className={inputClass}
                />
                {errors.fullName && (
                  <span className="text-[var(--danger)] text-xs mt-1 block">{errors.fullName.message}</span>
                )}
              </div>

              {/* Father's Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Father's Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('fatherName')}
                  className={inputClass}
                />
                {errors.fatherName && (
                  <span className="text-[var(--danger)] text-xs mt-1 block">{errors.fatherName.message}</span>
                )}
              </div>

              {/* Mother's Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Mother's Name
                </label>
                <input
                  type="text"
                  placeholder="Mary Doe"
                  {...register('motherName')}
                  className={inputClass}
                />
                {errors.motherName && (
                  <span className="text-[var(--danger)] text-xs mt-1 block">{errors.motherName.message}</span>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className={inputClass}
                />
                {errors.dateOfBirth && (
                  <span className="text-[var(--danger)] text-xs mt-1 block">{errors.dateOfBirth.message}</span>
                )}
              </div>

              {/* Place of Birth */}
              <div>
                <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                  Place of Birth
                </label>
                <input
                  type="text"
                  placeholder="Nairobi"
                  {...register('placeOfBirth')}
                  className={inputClass}
                />
                {errors.placeOfBirth && (
                  <span className="text-[var(--danger)] text-xs mt-1 block">{errors.placeOfBirth.message}</span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--slate-100)]" />

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className={inputClass}
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
                className={inputClass}
              />
              {errors.password && (
                <span className="text-[var(--danger)] text-xs mt-1 block">{errors.password.message}</span>
              )}
              <p className="text-xs text-[var(--slate-400)] mt-1.5">
                Min 8 characters, 1 uppercase, 1 number
              </p>
            </div>

            {/* ID Photo */}
            <div>
              <label className="block text-sm font-medium text-[var(--slate-700)] mb-1.5">
                ID Photo
              </label>
              <div
                className="relative border-2 border-dashed border-[var(--slate-200)] rounded-xl p-6 text-center hover:border-[var(--brand-400)] transition-colors cursor-pointer"
                onClick={() => document.getElementById('id-photo-input')?.click()}
              >
                <input
                  id="id-photo-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleIdPhotoChange}
                  className="hidden"
                />
                {idPhotoPreview ? (
                  <div className="relative w-full h-36 rounded-lg overflow-hidden">
                    <img
                      src={idPhotoPreview}
                      alt="ID Photo Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Change photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-[var(--slate-300)]" />
                    <p className="text-sm text-[var(--slate-500)]">
                      Click to upload your ID photo
                    </p>
                    <p className="text-xs text-[var(--slate-400)]">
                      JPEG, PNG, or WebP — max 5 MB
                    </p>
                  </div>
                )}
              </div>
              {errors.idPhoto && (
                <span className="text-[var(--danger)] text-xs mt-1 block">{errors.idPhoto.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--brand-600)] text-white font-medium py-2.5 rounded-xl hover:bg-[var(--brand-700)] active:bg-[var(--brand-800)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-[var(--slate-500)]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[var(--brand-600)] font-medium hover:text-[var(--brand-700)] transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
