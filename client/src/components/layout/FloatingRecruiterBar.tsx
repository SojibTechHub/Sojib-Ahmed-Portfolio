import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import RecruiterModal from '../recruiter/RecruiterModal';

export default function FloatingRecruiterBar() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Floating Recruiter Dock */}
      <motion.aside
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[8500] max-w-[94vw] sm:max-w-fit"
        aria-label="Recruiter Quick Actions"
      >
        <div className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#080B14]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(6,182,212,0.18)]">
          
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 pl-1 pr-2 border-r border-white/10 text-xs font-semibold text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Open to Work</span>
          </div>

          {/* 15-Sec Recruiter Pitch Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-xs font-bold shadow-md cursor-pointer hover:shadow-cyan-500/25 transition-all"
            title="Open 15-Second Executive Brief for Recruiters"
          >
            <Zap size={13} className="text-yellow-300 animate-pulse" />
            <span className="hidden xs:inline sm:inline">15s Brief</span>
            <span className="xs:hidden">Brief</span>
          </motion.button>

          {/* Direct Resume PDF Link */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
            title="Open Official Resume (PDF)"
          >
            <FileText size={13} className="text-[#06B6D4]" />
            <span className="hidden sm:inline">Resume</span>
          </motion.a>

          {/* Direct WhatsApp Quick Chat */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://wa.me/8801942791004"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-semibold transition-all cursor-pointer"
            title="Chat on WhatsApp (+880 1942791004)"
          >
            <FaWhatsapp size={14} />
            <span className="hidden md:inline">WhatsApp</span>
          </motion.a>

          {/* Quick Contact Scroll */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
          >
            <span>Hire Me ↓</span>
          </motion.button>

        </div>
      </motion.aside>

      {/* Recruiter Brief Modal */}
      <RecruiterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
