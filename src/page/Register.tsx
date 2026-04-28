import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authstore';
import type { RegisterRequest } from '../types/index';
import { Upload, Shield, Database, Fingerprint, Lock } from 'lucide-react';
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

  const features = [
    { icon: <Shield className="w-5 h-5" />, title: 'Sécurisé', desc: 'Chiffrement de bout en bout' },
    { icon: <Database className="w-5 h-5" />, title: 'Centralisé', desc: 'Base de données nationale' },
    { icon: <Fingerprint className="w-5 h-5" />, title: 'Vérifié', desc: 'Identité validée par l\'État' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Left branding panel — dark professional */}
      <div className="hidden lg:flex lg:w-[520px] bg-[#0F1629] flex-col justify-between p-12 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white text-base font-bold">K</span>
            </div>
            <div>
              <span className="text-white font-semibold text-lg tracking-tight block leading-tight">Kawaii Squad</span>
              <span className="text-white/40 text-[11px] font-medium uppercase tracking-wider">Madagascar</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/60 text-[11px] font-medium mb-6 backdrop-blur-sm">
            <Lock className="w-3 h-3" />
            Plateforme gouvernementale sécurisée
          </div>
          <h2 className="text-[32px] font-bold text-white leading-[1.2] mb-4 tracking-tight">
            Rejoignez le système<br />d'identité nationale
          </h2>
          <p className="text-white/50 text-[15px] leading-relaxed max-w-[360px]">
            Créez votre identité numérique et accédez aux services nationaux de la République de Madagascar.
          </p>

          <div className="mt-10 space-y-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">{f.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/25 text-xs">© 2026 Kawaii Squad — Tous droits réservés</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[480px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white text-base font-bold">K</span>
            </div>
            <div>
              <span className="text-[var(--text-primary)] font-semibold text-lg tracking-tight block leading-tight">Kawaii Squad</span>
              <span className="text-[var(--text-muted)] text-[11px] font-medium uppercase tracking-wider">Madagascar</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-[var(--text-primary)] tracking-tight">Créer un compte</h1>
            <p className="text-sm text-[var(--text-muted)] mt-2">Configurez votre identité numérique nationale</p>
          </div>

          <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] p-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Step indicator */}
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] text-white text-[11px] font-bold flex items-center justify-center">1</div>
                  <span className="text-xs font-medium text-[var(--text-primary)]">Identité</span>
                </div>
                <div className="flex-1 h-px bg-[var(--border-default)]" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--bg-hover)] text-[var(--text-muted)] text-[11px] font-bold flex items-center justify-center">2</div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">Compte</span>
                </div>
                <div className="flex-1 h-px bg-[var(--border-default)]" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--bg-hover)] text-[var(--text-muted)] text-[11px] font-bold flex items-center justify-center">3</div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">Photo</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Nom complet" type="text" placeholder="Jean Rakoto" {...register('fullName')} error={errors.fullName?.message} />
                </div>
                <Input label="Nom du père" type="text" placeholder="Pierre Rakoto" {...register('fatherName')} error={errors.fatherName?.message} />
                <Input label="Nom de la mère" type="text" placeholder="Marie Razafy" {...register('motherName')} error={errors.motherName?.message} />
                <Input label="Date de naissance" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
                <Input label="Lieu de naissance" type="text" placeholder="Antananarivo" {...register('placeOfBirth')} error={errors.placeOfBirth?.message} />
              </div>

              <div className="border-t border-[var(--border-subtle)]" />

              <Input label="Adresse email" type="email" placeholder="vous@exemple.com" {...register('email')} error={errors.email?.message} />
              <Input label="Mot de passe" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} hint="Min 8 caractères, 1 majuscule, 1 chiffre" />

              <div className="border-t border-[var(--border-subtle)]" />

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

              <Button type="submit" fullWidth isLoading={isLoading} size="lg">Créer le compte</Button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-[var(--text-muted)]">
              Déjà un compte ?{' '}
              <button type="button" onClick={() => navigate('/login')} className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition-colors cursor-pointer">Se connecter</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
