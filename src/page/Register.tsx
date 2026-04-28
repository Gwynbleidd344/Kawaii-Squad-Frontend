import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authstore';
import type { RegisterRequest } from '../types/index';
import { Upload } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const registerSchema = z.object({
  fullName: z.string().min(1, 'Nom complet requis').min(3, 'Minimum 3 caractères'),
  fatherName: z.string().min(1, 'Nom du père requis').min(3, 'Minimum 3 caractères'),
  motherName: z.string().min(1, 'Nom de la mère requis').min(3, 'Minimum 3 caractères'),
  dateOfBirth: z.string().min(1, 'Date de naissance requise'),
  placeOfBirth: z.string().min(1, 'Lieu de naissance requis').min(2, 'Minimum 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères').regex(/[A-Z]/, 'Au moins 1 majuscule').regex(/[0-9]/, 'Au moins 1 chiffre'),
  idPhoto: z.instanceof(File).refine((f) => f.size <= 5 * 1024 * 1024, 'Max 5 Mo').refine((f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type), 'JPEG, PNG ou WebP uniquement'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerData: RegisterRequest = { fullName: data.fullName, fatherName: data.fatherName, motherName: data.motherName, dateOfBirth: data.dateOfBirth, placeOfBirth: data.placeOfBirth, email: data.email, password: data.password, idPhoto: data.idPhoto };
      await registerUser(registerData);
      toast.success('Inscription réussie ! En attente d\'approbation.');
      navigate('/pending-approval');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de l\'inscription');
    }
  };

  const handleIdPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('idPhoto', file);
      const reader = new FileReader();
      reader.onloadend = () => setIdPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-[var(--accent)] flex-col justify-between p-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white text-sm font-bold">K</span>
          </div>
          <span className="text-white/90 font-semibold text-lg tracking-tight">Kawaii Squad</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-3">Rejoignez le système<br />d'identité nationale</h2>
          <p className="text-white/70 text-sm leading-relaxed">Créez votre identité numérique et accédez aux services nationaux de Madagascar.</p>
        </div>
        <p className="text-white/40 text-xs">© 2026 Kawaii Squad. Tous droits réservés.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-[460px]">
          <div className="text-center mb-8">
            <div className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--accent)] mb-4">
              <span className="text-white text-lg font-bold">K</span>
            </div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Créer un compte</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Configurez votre identité numérique</p>
          </div>

          <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Nom complet" type="text" placeholder="Jean Dupont" {...register('fullName')} error={errors.fullName?.message} />
                </div>
                <Input label="Nom du père" type="text" placeholder="Pierre Dupont" {...register('fatherName')} error={errors.fatherName?.message} />
                <Input label="Nom de la mère" type="text" placeholder="Marie Dupont" {...register('motherName')} error={errors.motherName?.message} />
                <Input label="Date de naissance" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
                <Input label="Lieu de naissance" type="text" placeholder="Antananarivo" {...register('placeOfBirth')} error={errors.placeOfBirth?.message} />
              </div>

              <div className="border-t border-[var(--border-subtle)]" />

              <Input label="Email" type="email" placeholder="vous@exemple.com" {...register('email')} error={errors.email?.message} />
              <Input label="Mot de passe" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} hint="Min 8 caractères, 1 majuscule, 1 chiffre" />

              {/* ID Photo */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Photo d'identité</label>
                <div className="relative border-2 border-dashed border-[var(--border-default)] rounded-xl p-6 text-center hover:border-[var(--accent)] transition-colors cursor-pointer"
                  onClick={() => document.getElementById('id-photo-input')?.click()}>
                  <input id="id-photo-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleIdPhotoChange} className="hidden" />
                  {idPhotoPreview ? (
                    <div className="relative w-full h-36 rounded-lg overflow-hidden">
                      <img src={idPhotoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium">Changer la photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-[var(--text-muted)]" />
                      <p className="text-sm text-[var(--text-secondary)]">Cliquez pour télécharger</p>
                      <p className="text-xs text-[var(--text-muted)]">JPEG, PNG ou WebP — max 5 Mo</p>
                    </div>
                  )}
                </div>
                {errors.idPhoto && <p className="text-xs text-[var(--danger)] mt-1.5">{errors.idPhoto.message}</p>}
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>Créer le compte</Button>

              <div className="text-center pt-2">
                <p className="text-sm text-[var(--text-muted)]">
                  Déjà un compte ?{' '}
                  <button type="button" onClick={() => navigate('/login')} className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition-colors cursor-pointer">Se connecter</button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
