import { useEffect, useState, useRef } from 'react';
import { useCinStore } from '../store/cinStore';
import { toast } from 'sonner';
import { Upload, CreditCard, Calendar, MapPin, Mail, CheckCircle, Download } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { useAppLayout } from '../components/AppLayout';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { InfoField } from '../components/ui/InfoField';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function MyCin() {
  const { cin, isLoading, hasFetched, fetchCin, createCin } = useCinStore();
  const { toggleSidebar } = useAppLayout();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCin = async () => {
    if (!cin) return;
    setIsDownloading(true);
    try {
      const element = document.getElementById('cin-export-card');
      if (!element) throw new Error("Élément d'export introuvable");

      // Use html-to-image to avoid oklch parsing errors from html2canvas
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#FFFFFF',
      });
      
      // Credit card size in mm: 85.6 x 53.98
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, 85.6, 53.98);
      pdf.save(`CIN-${cin.cinId}.pdf`);
      
      toast.success('CIN téléchargée avec succès en PDF');
    } catch (err) {
      console.error(err);
      toast.error('Échec du téléchargement PDF');
    } finally {
      setIsDownloading(false);
    }
  };

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

      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          {cin ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — CIN card */}
              <div className="lg:col-span-1 space-y-3">
                <Card padding="none" className="overflow-hidden">
                  {cin.cinPhotoUrl && <img src={cin.cinPhotoUrl} alt="CIN Photo" className="w-full aspect-[3/2] object-cover" />}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                        <span className="text-xs font-medium text-[var(--success)]">CIN Active</span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">ID : <span className="font-mono text-[var(--text-secondary)]">{cin.cinId}</span></p>
                  </div>
                </Card>
                {cin.cinPhotoUrl && (
                  <Button
                    variant="secondary"
                    fullWidth
                    icon={<Download className="w-4 h-4" />}
                    onClick={handleDownloadCin}
                    isLoading={isDownloading}
                  >
                    Télécharger la CIN en PDF
                  </Button>
                )}
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

        {/* ── Hidden template for PDF export ────────────────────────────────────────── */}
        {cin && (
          <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
            {/* The proportion 856x540 approximates 85.6mm x 54mm (Credit card ID-1 size) x 10 */}
            <div id="cin-export-card" className="w-[856px] h-[540px] relative overflow-hidden" style={{ boxSizing: 'border-box', border: '2px solid #E8ECF1', padding: '24px', backgroundColor: '#FFFFFF' }}>
              
              {/* Background watermark effect */}
              <div className="absolute inset-0 opacity-[0.03] z-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #000000 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}></div>
              
              <div className="absolute -right-20 -bottom-20 opacity-[0.02] z-0" style={{ color: '#000000' }}>
                <CreditCard className="w-[400px] h-[400px]" />
              </div>

              {/* Header: Flag colors and Country Name */}
              <div className="relative z-10 flex flex-col items-center mb-6">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-6 h-4 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }} />
                  <div className="w-6 h-4" style={{ backgroundColor: '#EF4444' }} />
                  <div className="w-6 h-4" style={{ backgroundColor: '#10B981' }} />
                </div>
                <h1 className="text-2xl font-bold tracking-widest uppercase m-0 leading-tight" style={{ color: '#111827' }}>Repoblikan'i Madagasikara</h1>
                <p className="text-[13px] font-medium uppercase tracking-widest mt-1" style={{ color: '#6B7280' }}>Carte d'Identité Nationale / Karapanondrom-Pirenena</p>
              </div>

              {/* Body: Photo + Info */}
              <div className="relative z-10 flex gap-8">
                {/* Photo Side */}
                <div className="w-[180px] shrink-0 flex flex-col items-center">
                  <div className="w-[180px] h-[240px] rounded-xl overflow-hidden border-[3px] shadow-sm relative mb-4" style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}>
                    {cin.cinPhotoUrl && (
                      <img src={cin.cinPhotoUrl} alt="Photo" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    )}
                  </div>
                  <div className="text-center w-full">
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Numéro / Laharana</p>
                    <p className="text-lg font-mono font-bold py-1.5 px-2 rounded-lg break-all leading-tight border shadow-inner" style={{ color: '#111827', backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }}>
                      {cin.cinId}
                    </p>
                  </div>
                </div>

                {/* Info Side */}
                <div className="flex-1 flex flex-col justify-center space-y-4 pt-2">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Nom et Prénoms / Anarana sy Fanampiny</p>
                    <p className="text-xl font-bold leading-tight" style={{ color: '#111827' }}>{cin.owner.fullName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Né(e) le / Teraka tamin'ny</p>
                      <p className="text-[17px] font-semibold leading-tight" style={{ color: '#1F2937' }}>
                        {new Date(cin.owner.dateOfBirth).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>À / Tao</p>
                      <p className="text-[17px] font-semibold leading-tight" style={{ color: '#1F2937' }}>{cin.owner.placeOfBirth}</p>
                    </div>
                  </div>

                  <div className="py-2 border-y border-dashed grid grid-cols-2 gap-4" style={{ borderColor: '#D1D5DB' }}>
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Fils de / Zanak'i</p>
                      <p className="text-[16px] font-medium leading-tight" style={{ color: '#1F2937' }}>{cin.owner.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Et de / Sy</p>
                      <p className="text-[16px] font-medium leading-tight" style={{ color: '#1F2937' }}>{cin.owner.motherName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Délivrée le / Nomena tamin'ny</p>
                      <p className="text-[15px] font-semibold leading-tight" style={{ color: '#1F2937' }}>
                        {new Date(cin.issuedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Signature de l'autorité</p>
                      <div className="mt-2 italic font-serif text-[17px]" style={{ color: '#D1D5DB' }}>
                         Digitalement certifiée
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </>
  );
}
