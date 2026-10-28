import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Download } from 'lucide-react';
import { certificates } from '../../data/certificates';

export default function Certificates() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="certificates" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 orb orb-violet opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-3xl" aria-hidden="true" />
      <div className="absolute top-1/4 right-10 w-72 h-72 orb orb-cyan opacity-10 pointer-events-none blur-3xl" aria-hidden="true" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-badge mx-auto w-fit mb-3">
            <span>🏆</span> Verified Credentials
          </div>
          <h2 className="section-heading">Certifications & Official Credentials</h2>
          <p className="section-subheading mx-auto text-center max-w-xl">
            Officially verified credentials, recommendations, engineering offer letters, and full-stack industry records.
          </p>
        </motion.div>

        {/* 4 Compact Credentials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {certificates.map((cert) => {
            const isFlyRank = cert.id === 'flyrank-offer-letter';
            const isPHCourse = cert.id === 'ph-complete-web-dev';
            const isPHRecommendation = cert.id === 'ph-recommendation-letter';

            return (
              <motion.div
                key={cert.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="card flex flex-col justify-between overflow-hidden bg-[var(--color-surface)]/80 backdrop-blur-md border border-white/10 hover:border-[#06B6D4]/50 shadow-lg rounded-2xl p-4 sm:p-5 group"
              >
                <div>
                  {/* Visual Document / Certificate Thumbnail */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/60 mb-3.5 border border-white/10 group-hover:border-white/20 transition-all">
                    {isPHRecommendation ? (
                      <div className="relative w-full h-full bg-[#0b1120]">
                        <img
                          src="/certificates/recommendation_letter.png"
                          alt={cert.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                    ) : isPHCourse ? (
                      <div className="relative w-full h-full bg-[#0b1120]">
                        <img
                          src="/certificates/certificate.png"
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                    ) : isFlyRank ? (
                      <div className="w-full h-full p-3.5 bg-gradient-to-br from-[#0c192c] via-[#08101d] to-[#040810] flex flex-col justify-between text-left relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#06B6D4]/10 blur-xl pointer-events-none" />
                        <div className="flex items-center justify-between z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg">🚀</span>
                            <span className="font-black text-xs tracking-widest text-[#06B6D4] uppercase">FlyRank</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
                            OFFICIAL
                          </span>
                        </div>
                        <div className="z-10 my-auto">
                          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Offer of Appointment</div>
                          <div className="text-xs font-black text-white leading-tight mt-0.5">
                            Full Stack Web Development Intern
                          </div>
                          <div className="text-[10px] text-gray-300 mt-1 font-mono">
                            Candidate: <span className="text-[#06B6D4] font-bold">Sojib Ahmed</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[8px] font-mono text-gray-400 border-t border-white/10 pt-1.5 z-10">
                          <span>Ref: FLYRANK-2026</span>
                          <span className="text-emerald-400 font-bold">✓ Verified</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full p-3.5 bg-gradient-to-br from-[#06241a] via-[#061510] to-[#020a06] flex flex-col justify-between text-left relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#10B981]/10 blur-xl pointer-events-none" />
                        <div className="flex items-center justify-between z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg">⚡</span>
                            <span className="font-black text-xs tracking-widest text-[#10B981] uppercase">Datheon AI</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                            INTERNSHIP
                          </span>
                        </div>
                        <div className="z-10 my-auto">
                          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Experience Record</div>
                          <div className="text-xs font-black text-white leading-tight mt-0.5">
                            Full Stack Systems & Engineering
                          </div>
                          <div className="text-[10px] text-gray-300 mt-1 font-mono">
                            Verification: <span className="text-[#10B981] font-bold">DT-2026-33B1M</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[8px] font-mono text-gray-400 border-t border-white/10 pt-1.5 z-10">
                          <span>datheon.in/verify</span>
                          <span className="text-[#10B981] font-bold">✓ Verified</span>
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay preview hint */}
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
                      title="Open document"
                    >
                      <span className="px-2.5 py-1 rounded-full bg-black/80 text-white text-[11px] font-semibold backdrop-blur-sm flex items-center gap-1 border border-white/20 shadow-lg">
                        <ExternalLink size={12} /> View Document
                      </span>
                    </a>
                  </div>

                  {/* Title & Organization */}
                  <div className="space-y-1 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse flex-shrink-0" />
                      <span className="text-[10px] font-bold tracking-wide uppercase text-gray-300 font-mono truncate">
                        {cert.badgeText}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-[#06B6D4] transition-colors leading-snug line-clamp-2">
                      {cert.title}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <span className="font-semibold text-[#06B6D4]">{cert.issuer}</span>
                      <span className="text-gray-400 font-mono text-[10px]">{cert.date}</span>
                    </div>
                  </div>

                  {/* Credential ID Chip */}
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 mb-2.5 flex items-center justify-between text-[10px]">
                    <span className="text-gray-400">ID:</span>
                    <span className="font-mono font-bold text-purple-300 truncate ml-1">{cert.credentialId}</span>
                  </div>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {cert.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-[9px] font-medium py-0.5 px-1.5 rounded bg-white/5 border border-white/5 text-gray-300 truncate"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 3 && (
                      <span className="text-[9px] font-mono py-0.5 px-1 rounded bg-white/5 text-gray-400">
                        +{cert.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="flex gap-1.5 pt-2.5 border-t border-white/5">
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#06B6D4]/15 hover:bg-[#06B6D4]/25 border border-[#06B6D4]/40 text-[#06B6D4] text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-sm"
                  >
                    <ExternalLink size={12} />
                    <span>Verify</span>
                  </a>
                  <a
                    href={cert.downloadUrl || cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                    title="View Document"
                  >
                    <Download size={12} />
                    <span>PDF</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
