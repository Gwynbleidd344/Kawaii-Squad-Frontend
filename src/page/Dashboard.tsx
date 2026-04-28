import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { IdentityStatus, Role } from '../types/index';
import { User, Calendar, MapPin, Mail, RefreshCw, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { TopBar } from '../components/TopBar';
import { useAppLayout } from '../components/AppLayout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { InfoField } from '../components/ui/InfoField';

function getStatusVariant(status: IdentityStatus): 'success' | 'warning' | 'danger' {
  const map: Record<string, 'success' | 'warning' | 'danger'> = {
    [IdentityStatus.CONFIRMED]: 'success',
    [IdentityStatus.PENDING]: 'warning',
    [IdentityStatus.REJECTED]: 'danger',
  };
  return map[status] || 'warning';
}

function getStatusLabel(status: IdentityStatus) {
  const labels: Record<string, string> = {
    [IdentityStatus.CONFIRMED]: 'Confirmé',
    [IdentityStatus.PENDING]: 'En attente',
    [IdentityStatus.REJECTED]: 'Rejeté',
  };
  return labels[status] || status;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, fetchCurrentUser } = useAuthStore();
  const { toggleSidebar } = useAppLayout();

  const handleRefreshProfile = async () => {
    try {
      await fetchCurrentUser();
      toast.success('Profil actualisé');
    } catch {
      toast.error('Échec de l\'actualisation du profil');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <TopBar
        title="Profil"
        subtitle="Gérer votre identité et vos informations"
        icon={<User className="w-5 h-5" />}
        onMenuClick={toggleSidebar}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={handleRefreshProfile}
          >
            Actualiser
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column — Profile summary card */}
            <div className="lg:col-span-1">
              <Card>
                <div className="flex flex-col items-center text-center">
                  {user.idPhotoUrl ? (
                    <img
                      src={user.idPhotoUrl}
                      alt="ID Photo"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-[var(--border-subtle)] mb-4"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-[var(--accent)]" />
                    </div>
                  )}

                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    {user.fullName}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">{user.email}</p>

                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant={getStatusVariant(user.status)}>
                      {getStatusLabel(user.status)}
                    </Badge>
                    {user.role === Role.ADMIN && (
                      <Badge variant="info">Admin</Badge>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] space-y-2">
                  <Button
                    variant="secondary"
                    fullWidth
                    icon={<CreditCard className="w-4 h-4" />}
                    onClick={() => navigate('/cin')}
                  >
                    Ma CIN
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right column — Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  <InfoField label="Nom complet" value={user.fullName} />
                  <InfoField label="Nom du père" value={user.fatherName} />
                  <InfoField label="Nom de la mère" value={user.motherName} />
                  <InfoField
                    label="Date de naissance"
                    value={new Date(user.dateOfBirth).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    icon={<Calendar className="w-3.5 h-3.5" />}
                  />
                  <InfoField
                    label="Lieu de naissance"
                    value={user.placeOfBirth}
                    icon={<MapPin className="w-3.5 h-3.5" />}
                  />
                  <InfoField
                    label="Email"
                    value={user.email}
                    icon={<Mail className="w-3.5 h-3.5" />}
                  />
                </div>
              </Card>

              {/* Status Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Statut du compte</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">Statut actuel</span>
                    <Badge variant={getStatusVariant(user.status)}>
                      {getStatusLabel(user.status)}
                    </Badge>
                  </div>

                  {user.rejectionReason && (
                    <div className="bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-lg p-3.5">
                      <p className="text-sm text-[var(--danger)]">
                        <span className="font-medium">Raison du rejet :</span> {user.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-[var(--border-subtle)] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField
                      label="Créé le"
                      value={new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    />
                    <InfoField
                      label="Mis à jour le"
                      value={new Date(user.updatedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
