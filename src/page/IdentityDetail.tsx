import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { IdentityStatus } from '../types/index';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, MapPin, Mail, Shield, Clock, CheckCircle, XCircle, User, AlertTriangle } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { useAppLayout } from '../components/AppLayout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { InfoField } from '../components/ui/InfoField';
import { Textarea } from '../components/ui/Input';

function getStatusVariant(status: IdentityStatus): 'success' | 'warning' | 'danger' {
  const map: Record<string, 'success' | 'warning' | 'danger'> = {
    [IdentityStatus.CONFIRMED]: 'success', [IdentityStatus.PENDING]: 'warning', [IdentityStatus.REJECTED]: 'danger',
  };
  return map[status] || 'warning';
}

function getStatusIcon(status: IdentityStatus) {
  switch (status) {
    case IdentityStatus.CONFIRMED: return <CheckCircle className="w-4 h-4" />;
    case IdentityStatus.PENDING: return <Clock className="w-4 h-4" />;
    case IdentityStatus.REJECTED: return <XCircle className="w-4 h-4" />;
  }
}

export default function IdentityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleSidebar } = useAppLayout();
  const { selectedIdentity, isLoading, fetchIdentityDetail, approveIdentity, rejectIdentity } = useAdminStore();
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) { fetchIdentityDetail(id).catch(() => { toast.error('Échec du chargement'); navigate('/admin'); }); }
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    setActionLoading(true);
    try { await approveIdentity(id); toast.success('Identité approuvée'); } catch { toast.error('Échec de l\'approbation'); } finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!id || !rejectReason.trim()) { toast.error('Veuillez fournir une raison'); return; }
    setActionLoading(true);
    try { await rejectIdentity(id, rejectReason.trim()); toast.success('Identité rejetée'); setShowRejectForm(false); setRejectReason(''); } catch { toast.error('Échec du rejet'); } finally { setActionLoading(false); }
  };

  if (isLoading && !selectedIdentity) {
    return (
      <>
        <TopBar title="Détail de l'identité" onMenuClick={toggleSidebar} actions={<Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/admin')}>Retour</Button>} />
        <div className="flex-1 flex items-center justify-center"><Spinner size="lg" /></div>
      </>
    );
  }

  if (!selectedIdentity) {
    return (
      <>
        <TopBar title="Identité introuvable" onMenuClick={toggleSidebar} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">Identité non trouvée</p>
            <Button variant="ghost" size="sm" className="mt-4" onClick={() => navigate('/admin')}>Retour au tableau de bord</Button>
          </div>
        </div>
      </>
    );
  }

  const identity = selectedIdentity;

  return (
    <>
      <TopBar title={identity.fullName} subtitle="Détail de l'identité" icon={<User className="w-5 h-5" />} onMenuClick={toggleSidebar}
        actions={<Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/admin')}>Retour</Button>} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — Photo & quick info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <div className="flex flex-col items-center text-center">
                  {identity.idPhotoUrl ? (
                    <img src={identity.idPhotoUrl} alt="ID Photo" className="w-full max-w-[200px] rounded-xl object-cover border-2 border-[var(--border-subtle)] mb-4" />
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center mb-4">
                      <User className="w-12 h-12 text-[var(--accent)]" />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">{identity.fullName}</h2>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">{identity.email}</p>
                  <div className="mt-3">
                    <Badge variant={getStatusVariant(identity.status)} icon={getStatusIcon(identity.status)}>{identity.status}</Badge>
                  </div>
                </div>
              </Card>

              {/* Actions card */}
              {identity.status === IdentityStatus.PENDING && (
                <Card>
                  <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                  <div className="space-y-3">
                    <Button fullWidth onClick={handleApprove} isLoading={actionLoading} icon={<CheckCircle className="w-4 h-4" />}
                      className="!bg-[var(--success)] hover:!bg-emerald-600">Approuver</Button>

                    {!showRejectForm ? (
                      <Button variant="danger" fullWidth onClick={() => setShowRejectForm(true)} icon={<XCircle className="w-4 h-4" />}>Rejeter</Button>
                    ) : (
                      <div className="space-y-3">
                        <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Raison du rejet…" rows={3} />
                        <div className="flex gap-2">
                          <Button variant="primary" className="flex-1 !bg-[var(--danger)] hover:!bg-red-600" onClick={handleReject} disabled={actionLoading || !rejectReason.trim()}>Confirmer</Button>
                          <Button variant="secondary" onClick={() => { setShowRejectForm(false); setRejectReason(''); }}>Annuler</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Right — Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  <InfoField label="Nom complet" value={identity.fullName} />
                  <InfoField label="Nom du père" value={identity.fatherName} />
                  <InfoField label="Nom de la mère" value={identity.motherName} />
                  <InfoField label="Date de naissance" value={new Date(identity.dateOfBirth).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })} icon={<Calendar className="w-3.5 h-3.5" />} />
                  <InfoField label="Lieu de naissance" value={identity.placeOfBirth} icon={<MapPin className="w-3.5 h-3.5" />} />
                  <InfoField label="Email" value={identity.email} icon={<Mail className="w-3.5 h-3.5" />} />
                </div>
              </Card>

              <Card>
                <CardHeader><CardTitle>Détails du compte</CardTitle></CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">Statut</span>
                    <Badge variant={getStatusVariant(identity.status)} icon={getStatusIcon(identity.status)}>{identity.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">Rôle</span>
                    <span className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1">
                      {identity.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />}{identity.role}
                    </span>
                  </div>
                  {identity.rejectionReason && (
                    <div className="bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-lg p-3.5">
                      <p className="text-sm text-[var(--danger)]"><span className="font-medium">Raison du rejet :</span> {identity.rejectionReason}</p>
                    </div>
                  )}
                  <div className="border-t border-[var(--border-subtle)] pt-4 grid grid-cols-2 gap-4">
                    <InfoField label="Créé le" value={new Date(identity.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                    <InfoField label="Mis à jour" value={new Date(identity.updatedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
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
