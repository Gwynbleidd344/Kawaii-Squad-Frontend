import { useEffect, useState } from 'react';
import { useCinStore } from '../store/cinStore';
import { toast } from 'sonner';
import { Upload, CreditCard, Calendar, MapPin, Mail, CheckCircle } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { useAppLayout } from '../components/AppLayout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { InfoField } from '../components/ui/InfoField';

export default function MyCin() {
  const { cin, isLoading, hasFetched, fetchCin, createCin } = useCinStore();
  const { toggleSidebar } = useAppLayout();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { if (!hasFetched) fetchCin(); }, [hasFetched, fetchCin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) { toast.error('Seuls les formats JPEG, PNG ou WebP sont acceptés'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Fichier trop volumineux. Maximum 5 Mo'); return; }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!selectedFile) { toast.error('Veuillez sélectionner une photo'); return; }
    setIsUploading(true);
    try { await createCin(selectedFile); toast.success('CIN créée avec succès !'); setSelectedFile(null); setPreviewUrl(null); }
    catch (error: any) {
      if (error?.status === 409) toast.info('Une CIN existe déjà pour votre compte');
      else toast.error(error?.message || 'Échec de la création');
    } finally { setIsUploading(false); }
  };

  if (isLoading && !hasFetched) {
    return (
      <>
        <TopBar title="Carte d'Identité Nationale" onMenuClick={toggleSidebar} />
        <div className="flex-1 flex items-center justify-center"><Spinner size="lg" /></div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Carte d'Identité Nationale" subtitle="Votre carte d'identité numérique officielle" icon={<CreditCard className="w-5 h-5" />} onMenuClick={toggleSidebar} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          {cin ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — CIN card */}
              <div className="lg:col-span-1">
                <Card padding="none" className="overflow-hidden">
                  {cin.cinPhotoUrl && <img src={cin.cinPhotoUrl} alt="CIN Photo" className="w-full aspect-[3/2] object-cover" />}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                      <span className="text-xs font-medium text-[var(--success)]">CIN Active</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">ID : <span className="font-mono text-[var(--text-secondary)]">{cin.cinId}</span></p>
                  </div>
                </Card>
              </div>

              {/* Right — Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader><CardTitle>Informations du titulaire</CardTitle></CardHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    <InfoField label="Nom complet" value={cin.owner.fullName} />
                    <InfoField label="Nom du père" value={cin.owner.fatherName} />
                    <InfoField label="Nom de la mère" value={cin.owner.motherName} />
                    <InfoField label="Date de naissance" value={new Date(cin.owner.dateOfBirth).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })} icon={<Calendar className="w-3.5 h-3.5" />} />
                    <InfoField label="Lieu de naissance" value={cin.owner.placeOfBirth} icon={<MapPin className="w-3.5 h-3.5" />} />
                    <InfoField label="Email" value={cin.owner.email} icon={<Mail className="w-3.5 h-3.5" />} />
                  </div>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Détails de la carte</CardTitle></CardHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    <InfoField label="CIN ID" value={cin.cinId} mono />
                    <div>
                      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">Statut</p>
                      <Badge variant="success" icon={<CheckCircle className="w-3 h-3" />}>CONFIRMÉ</Badge>
                    </div>
                    <InfoField label="Délivrée le" value={new Date(cin.issuedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                    <InfoField label="Mise à jour" value={new Date(cin.updatedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="max-w-lg mx-auto">
              <Card padding="lg" className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[var(--accent-subtle)] mb-5">
                  <CreditCard className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Créer votre CIN</h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">Téléchargez une photo pour générer votre Carte d'Identité Nationale</p>

                <div className="relative border-2 border-dashed border-[var(--border-default)] rounded-xl p-8 hover:border-[var(--accent)] transition-colors cursor-pointer mb-6"
                  onClick={() => document.getElementById('cin-photo-input')?.click()}>
                  <input id="cin-photo-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                  {previewUrl ? (
                    <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden">
                      <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium">Changer la photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="w-10 h-10 text-[var(--text-muted)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">Cliquez pour télécharger</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">JPEG, PNG ou WebP — max 5 Mo</p>
                      </div>
                    </div>
                  )}
                </div>

                <Button fullWidth onClick={handleCreate} disabled={!selectedFile} isLoading={isUploading}>Créer la CIN</Button>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
