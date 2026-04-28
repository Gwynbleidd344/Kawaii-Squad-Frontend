import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { IdentityStatus } from '../types/index';
import type { UserPublic } from '../types/index';
import { toast } from 'sonner';
import { Users, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { useAppLayout } from '../components/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';

const STATUS_TABS: { label: string; value: IdentityStatus | undefined }[] = [
  { label: 'Tous', value: undefined },
  { label: 'En attente', value: IdentityStatus.PENDING },
  { label: 'Confirmés', value: IdentityStatus.CONFIRMED },
  { label: 'Rejetés', value: IdentityStatus.REJECTED },
];

function getStatusVariant(status: IdentityStatus): 'success' | 'warning' | 'danger' {
  const map: Record<string, 'success' | 'warning' | 'danger'> = {
    [IdentityStatus.CONFIRMED]: 'success',
    [IdentityStatus.PENDING]: 'warning',
    [IdentityStatus.REJECTED]: 'danger',
  };
  return map[status] || 'warning';
}

function getStatusIcon(status: IdentityStatus) {
  switch (status) {
    case IdentityStatus.CONFIRMED: return <CheckCircle className="w-3.5 h-3.5" />;
    case IdentityStatus.PENDING: return <Clock className="w-3.5 h-3.5" />;
    case IdentityStatus.REJECTED: return <XCircle className="w-3.5 h-3.5" />;
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toggleSidebar } = useAppLayout();
  const { identities, pagination, statusFilter, isLoading, setStatusFilter, fetchAllIdentities, fetchPendingIdentities } = useAdminStore();
  const [page, setPage] = useState(1);

  useEffect(() => { loadIdentities(); }, [statusFilter, page]);

  const loadIdentities = async () => {
    try {
      if (statusFilter === IdentityStatus.PENDING) { await fetchPendingIdentities(page, 20); }
      else { await fetchAllIdentities(page, 20); }
    } catch { toast.error('Échec du chargement'); }
  };

  const handleFilter = (val: IdentityStatus | undefined) => { setStatusFilter(val); setPage(1); };

  return (
    <>
      <TopBar title="Gestion des identités" subtitle="Examiner et gérer les demandes" icon={<Users className="w-5 h-5" />} onMenuClick={toggleSidebar}
        actions={pagination && <span className="text-xs text-[var(--text-muted)] font-medium">{pagination.total} identité{pagination.total !== 1 ? 's' : ''}</span>} />

      <main className="flex-1 overflow-y-auto">
        <div className="px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-[var(--bg-hover)] rounded-lg p-1 w-fit">
            {STATUS_TABS.map((tab) => (
              <button key={tab.label} onClick={() => handleFilter(tab.value)}
                className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all cursor-pointer ${statusFilter === tab.value ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <Card padding="none">
            {isLoading && identities.length === 0 ? (
              <div className="p-16 text-center"><Spinner className="mx-auto mb-3" /><p className="text-sm text-[var(--text-muted)]">Chargement…</p></div>
            ) : identities.length === 0 ? (
              <EmptyState icon={<Search className="w-10 h-10" />} title="Aucune identité trouvée" description={statusFilter ? 'Essayez un autre filtre' : 'Aucun utilisateur inscrit'} />
            ) : (
              <>
                <div className="grid grid-cols-[1fr_1fr_130px_130px_80px] gap-4 px-6 py-3 border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
                  {['Utilisateur', 'Email', 'Statut', 'Inscription', 'Action'].map((h, i) => (
                    <p key={h} className={`text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider ${i === 4 ? 'text-right' : ''}`}>{h}</p>
                  ))}
                </div>
                {identities.map((id) => <IdentityRow key={id.id} identity={id} onView={() => navigate(`/admin/identities/${id.id}`)} />)}
              </>
            )}
          </Card>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-[var(--text-muted)]">Page {pagination.page} sur {pagination.pages}</p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} icon={<ChevronLeft className="w-4 h-4" />}>Précédent</Button>
                <Button variant="secondary" size="sm" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} iconRight={<ChevronRight className="w-4 h-4" />}>Suivant</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function IdentityRow({ identity, onView }: { identity: UserPublic; onView: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_130px_130px_80px] gap-4 px-6 py-3.5 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors items-center">
      <div className="flex items-center gap-3 min-w-0">
        {identity.idPhotoUrl ? (
          <img src={identity.idPhotoUrl} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-semibold text-[var(--accent)]">{identity.fullName.charAt(0)}</span>
          </div>
        )}
        <span className="text-sm font-medium text-[var(--text-primary)] truncate">{identity.fullName}</span>
      </div>
      <span className="text-sm text-[var(--text-secondary)] truncate">{identity.email}</span>
      <Badge variant={getStatusVariant(identity.status)} icon={getStatusIcon(identity.status)}>{identity.status}</Badge>
      <span className="text-xs text-[var(--text-muted)]">{new Date(identity.createdAt).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      <div className="text-right">
        <button onClick={onView} className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer">
          <Eye className="w-3.5 h-3.5" />Voir
        </button>
      </div>
    </div>
  );
}
