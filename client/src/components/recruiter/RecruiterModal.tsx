import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, CheckCircle2, Copy, Check, Sparkles, MapPin, Briefcase, Award } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import toast from 'react-hot-toast';

interface RecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecruiterModal({ isOpen, onClose }: RecruiterModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sojibahmedshorif998@gmail.com');
    setCopied(true);
    toast.success('Email copied: sojibahmedshorif998@gmail.com');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl max-h-[calc(100dvh-32px)] overflow-y-auto rounded-3xl bg-[#090D18] border border-cyan-500/30 shadow-[0_20px_70px_rgba(6,182,212,0.25)] text-left flex flex-col p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Close modal"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Header Badge & Title */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                Available for Immediate Hire
              </span>
              <span className="text-xs text-gray-400 font-mono">⚡ 15-Second Executive Brief</span>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-[#7C3AED] via-[#06B6D4] to-[#10B981] flex-shrink-0 shadow-lg">
                <img
                  src="/images/hero.jpg"
                  alt="Sojib Ahmed"
                  className="w-full h-full object-cover object-top rounded-[14px]"
                />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white leading-tight">Sojib Ahmed</h2>
                <p className="text-sm font-semibold text-[#06B6D4] mt-0.5">
                  Full-Stack Software Engineer · MERN & Next.js Architect
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-gray-500" />
                    Rangpur, BD (Remote Worldwide)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#10B981]">
                    <Briefcase size={12} />
                    Full-Time / Remote
                  </span>
                </div>
              </div>
            </div>

            {/* Fast Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-xl font-black text-white">4</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Flagship Systems</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-xl font-black text-[#06B6D4]">35+</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Tech & Tools</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-xl font-black text-[#10B981]">2</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Industry Records</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-xl font-black text-[#EC4899]">100%</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Clean Code</div>
              </div>
            </div>

            {/* Core Tech Stack */}
            <div className="mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#06B6D4]" />
                <span>Core Engineering Stack:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'React 19', 'Next.js 16', 'TypeScript', 'Node.js', 
                  'Express.js', 'MongoDB Atlas', 'Upstash Redis', 'Tailwind CSS', 
                  'Docker', 'GitHub Actions (CI/CD)', 'WebSockets', 'REST APIs'
                ].map(tech => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-gray-300 border border-white/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Verified Industry Social Proof */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/20 via-cyan-950/20 to-transparent border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#06B6D4] mb-2 flex items-center gap-1.5">
                <Award size={14} />
                <span>Verified Industry Credentials:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#10B981] flex-shrink-0" />
                  <span><strong>FlyRank:</strong> Full-Stack Development Offer of Appointment (2026)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#10B981] flex-shrink-0" />
                  <span><strong>Datheon AI Systems:</strong> Industry Full-Stack Engineering Internship</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#10B981] flex-shrink-0" />
                  <span><strong>Programming Hero:</strong> Executive Recommendation Letter (FoodFlow)</span>
                </li>
              </ul>
            </div>

            {/* CTAs & Direct Contact Actions */}
            <div className="mt-auto space-y-3 pt-3 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:from-[#6D28D9] hover:to-[#0891B2] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Download size={14} />
                  <span>Download Verified Resume (PDF)</span>
                </a>

                <a
                  href="https://wa.me/8801942791004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <FaWhatsapp size={15} />
                  <span>Chat on WhatsApp (+880 1942791004)</span>
                </a>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={12} className="text-[#10B981]" /> : <Copy size={12} />}
                    <span>{copied ? 'Email Copied!' : 'Copy Email'}</span>
                  </button>
                  <a
                    href="mailto:sojibahmedshorif998@gmail.com"
                    className="text-gray-400 hover:text-[#06B6D4] transition-colors"
                  >
                    sojibahmedshorif998@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.linkedin.com/in/sojib-ahmed-shorif"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-[#0077B5]/20 hover:bg-[#0077B5]/30 text-[#38BDF8] border border-[#0077B5]/30 transition-all"
                    title="LinkedIn"
                  >
                    <FaLinkedinIn size={13} />
                  </a>
                  <a
                    href="https://github.com/SojibTechHub"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all"
                    title="GitHub"
                  >
                    <FaGithub size={13} />
                  </a>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
