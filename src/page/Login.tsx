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
          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            Système de gestion<br />d'identité nationale
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Plateforme centralisée de gestion des données d'identité numérique pour Madagascar.
          </p>
        </div>
        <p className="text-white/40 text-xs">© 2026 Kawaii Squad. Tous droits réservés.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="text-center mb-8">
            <div className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--accent)] mb-4">
              <span className="text-white text-lg font-bold">K</span>
            </div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Bienvenue</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Connectez-vous à votre compte</p>
          </div>

          <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {statusError && (
                <div className={`p-3.5 rounded-lg text-sm border ${
                  statusError.status === IdentityStatus.PENDING ? 'bg-[var(--warning-bg)] border-[var(--warning-border)] text-amber-800' : 'bg-[var(--danger-bg)] border-[var(--danger-border)] text-red-800'
                }`}>
                  <p className="font-medium">{statusError.message}</p>
                  {statusError.reason && <p className="text-xs mt-1 opacity-80">{statusError.reason}</p>}
                </div>
              )}

              <Input label="Email" type="email" placeholder="vous@exemple.com" {...register('email')} error={errors.email?.message} />
              <Input label="Mot de passe" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />

              <Button type="submit" fullWidth isLoading={isLoading}>Se connecter</Button>

              <div className="text-center pt-2">
                <p className="text-sm text-[var(--text-muted)]">
                  Pas encore de compte ?{' '}
                  <button type="button" onClick={() => navigate('/register')} className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition-colors cursor-pointer">
                    Créer un compte
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
