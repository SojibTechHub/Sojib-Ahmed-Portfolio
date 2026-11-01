import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Download, Eye, X, Briefcase, GraduationCap, CheckCircle2, FileText } from 'lucide-react';
import { certificates as defaultCertificates, type Certificate } from '../../data/certificates';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type SectorTab = 'internship' | 'ph-certification';

export default function Certificates() {
  const [certList, setCertList] = useState<Certificate[]>(defaultCertificates);
  const [activeTab, setActiveTab] = useState<SectorTab>('internship');
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true });

  useEffect(() => {
    // 1. Try local storage cache with category sanitization
    try {
      const saved = localStorage.getItem('sojib_custom_certificates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((c: any) => {
            const id = ((c.id || c.customId || c._id || '') + '').toLowerCase();
            const issuer = ((c.issuer || '') + '').toLowerCase();
            if (id.includes('flyrank') || id.includes('datheon') || issuer.includes('flyrank') || issuer.includes('datheon')) {
              c.category = 'internship';
            } else {
              c.category = 'ph-certification';
            }
            return c;
          });
          setCertList(sanitized);
        }
      }
    } catch {}

    // 2. Fetch from backend API
    const fetchLiveCertificates = async () => {
      try {
        const res = await fetch(`${API_BASE}/certificates`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const sanitized = data.data.map((c: any) => {
            const id = ((c.id || c.customId || c._id || '') + '').toLowerCase();
            const issuer = ((c.issuer || '') + '').toLowerCase();
            if (id.includes('flyrank') || id.includes('datheon') || issuer.includes('flyrank') || issuer.includes('datheon')) {
              c.category = 'internship';
            } else {
              c.category = 'ph-certification';
            }
            return c;
          });
          setCertList(sanitized);
          localStorage.setItem('sojib_custom_certificates', JSON.stringify(sanitized));
        }
      } catch {}
    };

    fetchLiveCertificates();
  }, []);

  // Strict classification to guarantee 0 crossover between sectors:
  // Sector 1 (Intern): FlyRank and Datheon AI Systems
  const isInternship = (c: Certificate) => {
    const id = ((c.id || (c as any).customId || (c as any)._id || '') + '').toLowerCase();
    const issuer = ((c.issuer || '') + '').toLowerCase();
    const title = ((c.title || '') + '').toLowerCase();
    return id.includes('flyrank') || 
           id.includes('datheon') || 
           issuer.includes('flyrank') || 
           issuer.includes('datheon') || 
           title.includes('flyrank') || 
           title.includes('datheon');
  };

  // Sector 2 (PH): Programming Hero Recommendation Letter & Batch 13 Course Certificate
  const isPH = (c: Certificate) => {
    // Explicitly exclude any internship / industry records from PH sector
    if (isInternship(c)) return false;
    const id = ((c.id || (c as any).customId || (c as any)._id || '') + '').toLowerCase();
    const issuer = ((c.issuer || '') + '').toLowerCase();
    const title = ((c.title || '') + '').toLowerCase();
    return id.includes('ph-') || 
           id.includes('recommendation') ||
           issuer.includes('hero') || 
           title.includes('programming hero') || 
           title.includes('recommendation') || 
           title.includes('complete web');
  };

  const internshipCerts = certList.filter(isInternship);
  const phCerts = certList.filter(isPH);

  return (
    <section id="certificates" className="section-padding relative overflow-hidden bg-[#030712]" ref={ref}>
      {/* Background Ambience Orbs */}
      <div className="absolute top-1/3 left-1/2 w-96 h-96 orb orb-violet opacity-15 -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-3xl" aria-hidden="true" />
      <div className="absolute top-1/4 right-10 w-80 h-80 orb orb-cyan opacity-15 pointer-events-none blur-3xl" aria-hidden="true" />

      <div className="container-custom relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-badge mx-auto w-fit mb-3">
            <span>🏆</span> Verified Credentials
          </div>
          <h2 className="section-heading">Industry Internships & Official Certifications</h2>
          <p className="section-subheading mx-auto text-center max-w-2xl text-gray-400">
            Separated into two distinct sectors: Verified <strong className="text-white">Industry Internships & Appointment Letters</strong> and official <strong className="text-white">Programming Hero Certifications & Endorsements</strong>.
          </p>

          <div className="mt-4 flex items-center justify-center">
            <a
              href="https://drive.google.com/file/d/1I_yOQ82k2LqFINo5RuR_tXVEzzwAZkGx/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#06B6D4]/40 text-[#22D3EE] hover:text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105"
            >
              <FileText size={14} />
              <span>View Complete Full-Stack Engineering Resume (Drive)</span>
              <ExternalLink size={12} className="opacity-80" />
            </a>
          </div>

          {/* Two Distinct Sector Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            <button
              onClick={() => setActiveTab('internship')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                activeTab === 'internship'
                  ? 'bg-gradient-to-r from-[#06B6D4] to-[#10B981] text-white shadow-lg shadow-[#10B981]/25 scale-105 border border-emerald-400/40'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <Briefcase size={16} className={activeTab === 'internship' ? 'text-white' : 'text-[#06B6D4]'} />
              <span>💼 Industry Internships & Offers</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-black/30 font-mono font-bold text-white">
                {internshipCerts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ph-certification')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                activeTab === 'ph-certification'
                  ? 'bg-gradient-to-r from-[#EC4899] to-[#7C3AED] text-white shadow-lg shadow-[#EC4899]/25 scale-105 border border-pink-400/40'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <GraduationCap size={17} className={activeTab === 'ph-certification' ? 'text-white' : 'text-[#EC4899]'} />
              <span>🎓 Programming Hero Credentials</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-black/30 font-mono font-bold text-white">
                {phCerts.length}
              </span>
            </button>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* SECTOR 1: INDUSTRY INTERNSHIPS & APPOINTMENTS (ONLY 2) */}
        {/* ======================================================== */}
        {activeTab === 'internship' && (
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06B6D4]/30 to-[#10B981]/20 border border-[#06B6D4]/40 flex items-center justify-center text-[#06B6D4] shadow-md">
                <Briefcase size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    Sector 1: Industry Appointments & Engineering Internships
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
                    {internshipCerts.length} Industry Records
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Verified appointment offer letter and engineering experience record with verified IDs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {internshipCerts.map((cert) => renderCredentialCard(cert, 'internship', () => setPreviewCert(cert)))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTOR 2: PROGRAMMING HERO CERTIFICATIONS (ONLY 2) */}
        {/* ======================================================== */}
        {activeTab === 'ph-certification' && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EC4899]/30 to-[#7C3AED]/20 border border-[#EC4899]/40 flex items-center justify-center text-[#EC4899] shadow-md">
                <GraduationCap size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                    Sector 2: Programming Hero Certifications & Official Recommendations
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30">
                    {phCerts.length} PH Records
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Executive Letter of Recommendation by CEO Jhankar Mahbub & Complete Web Development Course Certification.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {phCerts.map((cert) => renderCredentialCard(cert, 'ph-certification', () => setPreviewCert(cert)))}
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE DOCUMENT LIGHTBOX / PREVIEW MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl max-h-[92dvh] bg-[#0A0F1D] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#050A14] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED]/30 to-[#06B6D4]/30 border border-white/15 flex items-center justify-center text-lg shadow-sm">
                    {previewCert.issuerLogo || '📜'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                      {previewCert.title}
                    </h3>
                    <p className="text-xs text-[#06B6D4] font-medium flex items-center gap-2 mt-0.5">
                      <span>{previewCert.issuer}</span>
                      <span>·</span>
                      <span className="text-gray-400 font-mono">{previewCert.credentialId}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewCert(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Document Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#03060E]">
                {previewCert.id === 'ph-recommendation-letter' || (previewCert.image && previewCert.image.includes('recommendation_letter')) ? (
                  <div className="flex flex-col items-center">
                    <img
                      src="/certificates/recommendation_letter.png"
                      alt={previewCert.title}
                      className="w-full max-w-2xl rounded-xl shadow-2xl border border-white/15 object-contain"
                    />
                  </div>
                ) : previewCert.id === 'ph-complete-web-dev' || (previewCert.image && previewCert.image.includes('certificate.png')) ? (
                  <div className="flex flex-col items-center">
                    <img
                      src="/certificates/certificate.png"
                      alt={previewCert.title}
                      className="w-full max-w-2xl rounded-xl shadow-2xl border border-white/15 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0A1628] to-[#040812] border border-[#06B6D4]/30 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{previewCert.issuerLogo || '🏢'}</span>
                        <div>
                          <div className="text-lg font-black text-white">{previewCert.issuer}</div>
                          <div className="text-xs text-[#06B6D4] font-mono">{previewCert.badgeText}</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> Officially Verified
                      </span>
                    </div>

                    <div className="py-4 space-y-2">
                      <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">Position / Appointment</div>
                      <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {previewCert.title}
                      </div>
                      <div className="text-sm text-gray-300 mt-2">
                        Awarded to <strong className="text-[#06B6D4]">Sojib Ahmed</strong> · {previewCert.duration || previewCert.date}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[11px]">Credential ID</span>
                        <span className="font-mono font-bold text-white text-sm">{previewCert.credentialId}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Period / Date</span>
                        <span className="font-semibold text-white">{previewCert.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Status</span>
                        <span className="text-emerald-400 font-bold">Verified Record</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#050A14] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                <div className="text-xs text-gray-400">
                  Credential ID: <strong className="text-white font-mono">{previewCert.credentialId}</strong>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href={previewCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-xs font-bold flex items-center gap-1.5 hover:shadow-lg hover:shadow-[#06B6D4]/30 transition-all cursor-pointer"
                  >
                    <ExternalLink size={14} />
                    <span>Open Official Document</span>
                  </a>
                  <a
                    href={previewCert.downloadUrl || previewCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Helper to render individual credential cards
function renderCredentialCard(cert: Certificate, sector: 'internship' | 'ph-certification', onPreview: () => void) {
  const certId = cert.id || (cert as any)._id || cert.title;
  const isFlyRank = certId === 'flyrank-offer-letter' || cert.issuer?.toLowerCase().includes('flyrank');
  const isDatheon = certId === 'datheon-internship' || cert.issuer?.toLowerCase().includes('datheon');
  const isPHRecommendation = certId === 'ph-recommendation-letter' || (cert.image && cert.image.includes('recommendation_letter'));
  const isPHCourse = certId === 'ph-complete-web-dev' || (cert.image && cert.image.includes('certificate.png'));

  const borderColor = sector === 'internship' 
    ? (isFlyRank ? 'hover:border-[#06B6D4]/60' : 'hover:border-[#10B981]/60')
    : (isPHRecommendation ? 'hover:border-[#EC4899]/60' : 'hover:border-[#7C3AED]/60');

  return (
    <motion.div
      key={certId}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`card flex flex-col justify-between overflow-hidden bg-[#0A0F1D]/90 backdrop-blur-md border border-white/10 ${borderColor} shadow-xl rounded-2xl p-5 sm:p-6 group transition-all duration-300`}
    >
      <div>
        {/* Top Header Row of Card */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md flex-shrink-0 ${
              isFlyRank ? 'bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#06B6D4]' :
              isDatheon ? 'bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981]' :
              isPHRecommendation ? 'bg-[#EC4899]/20 border border-[#EC4899]/40 text-[#EC4899]' :
              'bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#A78BFA]'
            }`}>
              {cert.issuerLogo || (sector === 'internship' ? '💼' : '🎓')}
            </div>
            <div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border inline-flex items-center gap-1 ${
                sector === 'internship'
                  ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30'
                  : 'bg-[#EC4899]/15 text-[#F472B6] border-[#EC4899]/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {cert.badgeText}
              </span>
              <div className="text-xs text-gray-400 font-semibold mt-1">
                {cert.issuer} · <span className="font-mono text-gray-300">{cert.date}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onPreview}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Inspect Document"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Visual Document Preview Area */}
        <div 
          onClick={onPreview}
          className="relative w-full h-48 rounded-xl overflow-hidden bg-black/60 mb-4 border border-white/10 group-hover:border-white/25 transition-all cursor-pointer"
        >
          {isPHRecommendation ? (
            <div className="relative w-full h-full bg-[#0b1120]">
              <img
                src="/certificates/recommendation_letter.png"
                alt={cert.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 text-left">
                <span className="text-[10px] font-mono text-pink-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-pink-500/30">
                  RID: PH-R 1190 · Signed by Jhankar Mahbub
                </span>
              </div>
            </div>
          ) : isPHCourse ? (
            <div className="relative w-full h-full bg-[#0b1120]">
              <img
                src="/certificates/certificate.png"
                alt={cert.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 text-left">
                <span className="text-[10px] font-mono text-purple-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-purple-500/30">
                  Batch 13 · Certificate of Excellence
                </span>
              </div>
            </div>
          ) : isFlyRank ? (
            <div className="w-full h-full p-4 bg-gradient-to-br from-[#0c1e36] via-[#081324] to-[#040810] flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#06B6D4]/15 blur-xl pointer-events-none" />
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  <span className="font-black text-sm tracking-widest text-[#06B6D4] uppercase">FlyRank</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40">
                  OFFICIAL APPOINTMENT
                </span>
              </div>
              <div className="z-10 my-auto">
                <div className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">Engineering Offer Letter</div>
                <div className="text-sm font-black text-white leading-tight mt-0.5">
                  Full Stack Web Development Intern
                </div>
                <div className="text-xs text-gray-300 mt-1 font-mono">
                  Candidate: <strong className="text-[#06B6D4]">Sojib Ahmed</strong>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-300 border-t border-white/10 pt-2 z-10">
                <span>Ref: FLYRANK-2026-ENG-SOJIB</span>
                <span className="text-emerald-400 font-bold">✓ Verified</span>
              </div>
            </div>
          ) : isDatheon ? (
            <div className="w-full h-full p-4 bg-gradient-to-br from-[#06291e] via-[#061812] to-[#020a06] flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#10B981]/15 blur-xl pointer-events-none" />
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <span className="font-black text-sm tracking-widest text-[#10B981] uppercase">Datheon AI</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                  EXPERIENCE RECORD
                </span>
              </div>
              <div className="z-10 my-auto">
                <div className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">Full Stack Systems Record</div>
                <div className="text-sm font-black text-white leading-tight mt-0.5">
                  Full Stack Engineering Internship
                </div>
                <div className="text-xs text-gray-300 mt-1 font-mono">
                  ID: <strong className="text-[#10B981]">DT-2026-33B1M</strong>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-300 border-t border-white/10 pt-2 z-10">
                <span>datheon.in/verify</span>
                <span className="text-[#10B981] font-bold">✓ Verified</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full p-4 bg-gradient-to-br from-purple-900/40 to-cyan-900/40 flex flex-col justify-between text-left">
              <div className="text-sm font-bold text-white line-clamp-2">{cert.title}</div>
              <div className="text-xs text-emerald-400 font-mono font-bold">✓ Verified Credential</div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <span className="px-3 py-1.5 rounded-full bg-black/80 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5 border border-white/20 shadow-lg">
              <Eye size={13} /> Click to Inspect Full Document
            </span>
          </div>
        </div>

        {/* Title & Duration */}
        <div className="space-y-1 mb-3">
          <h4 className="text-base font-bold text-white group-hover:text-[#06B6D4] transition-colors leading-snug">
            {cert.title}
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            {cert.duration}
          </p>
        </div>

        {/* Credential ID Chip */}
        {cert.credentialId && (
          <div className="p-2 rounded-xl bg-black/40 border border-white/10 mb-3 flex items-center justify-between text-xs">
            <span className="text-gray-400">Credential ID:</span>
            <span className="font-mono font-bold text-[#06B6D4] truncate ml-1">{cert.credentialId}</span>
          </div>
        )}

        {/* Skills Tags */}
        {Array.isArray(cert.skills) && cert.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {cert.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-semibold py-0.5 px-2 rounded-lg bg-white/5 border border-white/5 text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Direct Action Links */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <a
          href={cert.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#7C3AED]/20 to-[#06B6D4]/20 hover:from-[#7C3AED]/30 hover:to-[#06B6D4]/30 border border-[#06B6D4]/40 text-[#06B6D4] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <ExternalLink size={13} />
          <span>Verify Document</span>
        </a>
        <a
          href={cert.downloadUrl || cert.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          title="Download PDF"
        >
          <Download size={13} />
          <span>PDF</span>
        </a>
      </div>
    </motion.div>
  );
}
