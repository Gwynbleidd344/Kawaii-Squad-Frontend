import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAdminStore } from '../store/adminStore';
import { ArrowLeft, Shield, UserPlus } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { useAppLayout } from '../components/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const createAdminSchema = z.object({
  fullName: z.string().min(1, 'Nom complet requis').min(3, 'Min 3 caractères'),
  fatherName: z.string().min(1, 'Nom du père requis').min(3, 'Min 3 caractères'),
  motherName: z.string().min(1, 'Nom de la mère requis').min(3, 'Min 3 caractères'),
  dateOfBirth: z.string().min(1, 'Date de naissance requise'),
  placeOfBirth: z.string().min(1, 'Lieu de naissance requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Min 8 caractères').regex(/[A-Z]/, 'Au moins 1 majuscule').regex(/[0-9]/, 'Au moins 1 chiffre'),
  adminSecret: z.string().optional(),
});

type CreateAdminFormData = z.infer<typeof createAdminSchema>;

export default function CreateAdmin() {
  const navigate = useNavigate();
  const { createAdmin, isLoading } = useAdminStore();
  const { toggleSidebar } = useAppLayout();
  const [useSecret, setUseSecret] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateAdminFormData>({ resolver: zodResolver(createAdminSchema) });

  const onSubmit = async (data: CreateAdminFormData) => {
    try {
      const { adminSecret, ...adminData } = data;
      await createAdmin(adminData, useSecret ? adminSecret : undefined);
      toast.success('Compte administrateur créé');
      navigate('/admin');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Échec de la création');
    }
  };

  return (
    <>
      <TopBar title="Créer un administrateur" subtitle="Nouveau compte avec accès complet" icon={<UserPlus className="w-5 h-5" />} onMenuClick={toggleSidebar}
        actions={<Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/admin')}>Retour</Button>} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--accent)] mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">Compte Administrateur</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">Remplissez les informations ci-dessous</p>
          </div>

          <Card>
            {/* Auth method toggle */}
            <div className="mb-6 p-3 bg-[var(--bg-primary)] rounded-lg">
              <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Méthode d'authentification</p>
              <div className="flex gap-1 bg-[var(--bg-hover)] rounded-md p-1">
                <button type="button" onClick={() => setUseSecret(false)}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${!useSecret ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
                  Bearer Token (JWT)
                </button>
                <button type="button" onClick={() => setUseSecret(true)}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${useSecret ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
                  Master Secret
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {useSecret && (
                <Input label="Admin Master Secret" type="password" placeholder="x-admin-secret" {...register('adminSecret')} hint="Requis pour le premier compte admin" />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Nom complet" type="text" placeholder="Admin User" {...register('fullName')} error={errors.fullName?.message} />
                </div>
                <Input label="Nom du père" type="text" placeholder="Jean" {...register('fatherName')} error={errors.fatherName?.message} />
                <Input label="Nom de la mère" type="text" placeholder="Marie" {...register('motherName')} error={errors.motherName?.message} />
                <Input label="Date de naissance" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
                <Input label="Lieu de naissance" type="text" placeholder="Ville" {...register('placeOfBirth')} error={errors.placeOfBirth?.message} />
              </div>

              <div className="border-t border-[var(--border-subtle)]" />

              <Input label="Email" type="email" placeholder="admin@exemple.com" {...register('email')} error={errors.email?.message} />
              <Input label="Mot de passe" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} hint="Min 8 caractères, 1 majuscule, 1 chiffre" />

              <Button type="submit" fullWidth isLoading={isLoading}>Créer le compte admin</Button>
            </form>
          </Card>
        </div>
      </main>
    </>
  );
}
