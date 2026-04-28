import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authstore';
import { IdentityStatus } from '../types/index';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Shield, Database, Fingerprint, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [statusError, setStatusError] = useState<{ status: string; message: string; reason?: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setStatusError(null);
    try {
      await login(data);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.status) {
        const d = error.response.data;
        setStatusError({ status: d.status, message: d.message, reason: d.reason });
        if (d.status === IdentityStatus.PENDING) toast.error('Votre compte est en attente d\'approbation.');
        else if (d.status === IdentityStatus.REJECTED) toast.error(`Compte rejeté : ${d.reason}`);
      } else {
        toast.error(error instanceof Error ? error.message : 'Échec de connexion');
      }
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
      <div className="hidden lg:flex lg:w-[520px] bg-[#0F1629] flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }} />

        {/* Content */}
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
            Système National<br />d'Identité Numérique
          </h2>
          <p className="text-white/50 text-[15px] leading-relaxed max-w-[360px]">
            Plateforme centralisée de gestion et de vérification des identités pour la République de Madagascar.
          </p>

          {/* Feature cards */}
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
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
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

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-[var(--text-primary)] tracking-tight">Connexion</h1>
            <p className="text-sm text-[var(--text-muted)] mt-2">Accédez à votre espace d'identité nationale</p>
          </div>

          {/* Form card */}
          <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] p-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {statusError && (
                <div className={`p-3.5 rounded-lg text-sm border ${
                  statusError.status === IdentityStatus.PENDING
                    ? 'bg-[var(--warning-bg)] border-[var(--warning-border)] text-amber-800'
                    : 'bg-[var(--danger-bg)] border-[var(--danger-border)] text-red-800'
                }`}>
                  <p className="font-medium">{statusError.message}</p>
                  {statusError.reason && <p className="text-xs mt-1 opacity-80">{statusError.reason}</p>}
                </div>
              )}

              <Input
                label="Adresse email"
                type="email"
                placeholder="vous@exemple.com"
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />

              <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                Se connecter
              </Button>
            </form>
          </div>

          {/* Bottom link */}
          <div className="text-center mt-6">
            <p className="text-sm text-[var(--text-muted)]">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition-colors cursor-pointer"
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
