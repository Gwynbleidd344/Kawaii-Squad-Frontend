import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { IdentityStatus } from '../types/index';
import { toast } from 'sonner';
import { Clock, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function PendingApproval() {
  const navigate = useNavigate();
  const { user, fetchUserStatus } = useAuthStore();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => { if (!user) navigate('/register'); }, [user, navigate]);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const status = await fetchUserStatus();
      if (status === IdentityStatus.CONFIRMED) { toast.success('Votre identité a été confirmée !'); navigate('/login'); }
      else if (status === IdentityStatus.REJECTED) { toast.error('Votre identité a été rejetée.'); navigate('/register'); }
    } catch { toast.error('Échec de la vérification'); } finally { setIsChecking(false); }
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case IdentityStatus.CONFIRMED: return { icon: <CheckCircle className="w-12 h-12 text-[var(--success)]" />, bgClass: 'bg-[var(--success-bg)]', title: 'Identité confirmée' };
      case IdentityStatus.REJECTED: return { icon: <XCircle className="w-12 h-12 text-[var(--danger)]" />, bgClass: 'bg-[var(--danger-bg)]', title: 'Demande rejetée' };
      default: return { icon: <Clock className="w-12 h-12 text-[var(--warning)]" />, bgClass: 'bg-[var(--warning-bg)]', title: 'En cours de vérification' };
    }
  };

  const config = getStatusConfig(user?.status);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-xl ${config.bgClass} mb-6`}>
            {config.icon}
          </div>

          <h1 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight mb-2">{config.title}</h1>

          {user?.status === IdentityStatus.PENDING && (
            <>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                Merci pour votre inscription ! Votre identité est en cours de vérification par nos administrateurs. Cela prend généralement 24 à 48 heures.
              </p>
              <p className="text-xs text-[var(--text-muted)] mb-6">
                Un email de confirmation sera envoyé à <span className="font-medium text-[var(--text-secondary)]">{user?.email}</span> une fois approuvé.
              </p>
            </>
          )}

          {user?.status === IdentityStatus.CONFIRMED && (
            <>
              <p className="text-sm text-[var(--text-secondary)] mb-2">Félicitations ! Votre identité a été confirmée.</p>
              <p className="text-xs text-[var(--text-muted)] mb-6">Vous pouvez maintenant vous connecter.</p>
            </>
          )}

          {user?.status === IdentityStatus.REJECTED && (
            <>
              <p className="text-sm text-[var(--text-secondary)] mb-3">Malheureusement, votre demande a été rejetée.</p>
              {user?.rejectionReason && (
                <div className="bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-lg p-3.5 mb-4 text-left">
                  <p className="text-sm text-[var(--danger)]"><span className="font-medium">Raison :</span> {user.rejectionReason}</p>
                </div>
              )}
              <p className="text-xs text-[var(--text-muted)] mb-6">Vous pouvez vous réinscrire avec les informations corrigées.</p>
            </>
          )}

          <div className="space-y-3">
            <Button fullWidth onClick={handleCheckStatus} isLoading={isChecking} icon={<RefreshCw className="w-4 h-4" />}>Vérifier le statut</Button>

            {user?.status === IdentityStatus.CONFIRMED && (
              <Button variant="secondary" fullWidth onClick={() => navigate('/login')}>Se connecter</Button>
            )}
            {user?.status === IdentityStatus.REJECTED && (
              <Button variant="secondary" fullWidth onClick={() => navigate('/register')}>Se réinscrire</Button>
            )}

            <button onClick={() => navigate('/login')} className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] py-2 transition-colors cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
