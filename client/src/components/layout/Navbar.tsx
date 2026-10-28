import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, FileText, ArrowUpRight, Shield } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPos = window.scrollY + 160;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const id = navLinks[i].href.replace('#', '');
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[9000] transition-all duration-300 ${
          scrolled
            ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] shadow-xl shadow-black/40 py-2.5'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between" aria-label="Main navigation">
            {/* Left: Brand / Logo */}
            <motion.a
              id="nav-logo"
              href="#home"
              onClick={() => handleNavClick('#home')}
              className="relative flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Sojib Ahmed - Home"
            >
              <div className="relative w-10 h-10 rounded-xl p-[1px] bg-gradient-to-tr from-[#7C3AED] via-[#06B6D4] to-[#10B981] shadow-md shadow-[rgba(124,58,237,0.3)] flex-shrink-0">
                <div className="w-full h-full bg-[#050508] rounded-[11px] flex items-center justify-center relative overflow-hidden group-hover:bg-[#0B1120] transition-colors">
                  <span className="font-black text-sm bg-gradient-to-r from-[#A78BFA] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
                    SA
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-[14px] sm:text-[15px] font-bold text-white group-hover:text-[#22D3EE] transition-colors leading-tight flex items-center gap-1.5">
                  Sojib Ahmed
                  <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block shadow-[0_0_8px_#10B981] animate-pulse" />
                </div>
                <div className="text-[11px] font-medium text-[var(--color-text-secondary)] tracking-wide mt-0.5">
                  Full Stack Developer
                </div>
              </div>
            </motion.a>

            {/* Middle: Desktop Nav Links Pill */}
            <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0B1120]/80 border border-[rgba(255,255,255,0.06)] shadow-inner">
              {navLinks.map((link) => {
                const id = link.href.replace('#', '');
                const isActive = activeSection === id;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED]/80 to-[#06B6D4]/80 shadow-md shadow-[#7C3AED]/20"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5">
              {/* Admin CMS Direct Access */}
              <motion.a
                href="/admin"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-[#0B1120] border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all cursor-pointer shadow-sm"
                title="Admin Control Panel"
              >
                <Shield size={13} className="text-purple-400" />
                <span>Admin</span>
              </motion.a>

              {/* View Resume CTA */}
              <motion.a
                href="https://drive.google.com/file/d/1I_yOQ82k2LqFINo5RuR_tXVEzzwAZkGx/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(6,182,212,0.45)' }}
                whileTap={{ scale: 0.96 }}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
                aria-label="View Resume"
              >
                <FileText size={14} />
                <span>View Resume</span>
                <ArrowUpRight size={13} className="opacity-80" />
              </motion.a>

              {/* Mobile Menu Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#0B1120] border border-[rgba(255,255,255,0.08)] text-[var(--color-text-secondary)] hover:text-white hover:border-[#06B6D4] transition-all"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-[8999] bg-[#030712]/98 backdrop-blur-2xl border-b border-[rgba(255,255,255,0.1)] p-6 shadow-2xl lg:hidden flex flex-col gap-3"
          >
            <nav className="flex flex-col gap-2" role="list">
              {navLinks.map((link) => {
                const id = link.href.replace('#', '');
                const isActive = activeSection === id;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-[#7C3AED]/15 text-[#06B6D4] border border-[#7C3AED]/30'
                        : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[rgba(255,255,255,0.08)] flex flex-col gap-2">
              <a
                href="/admin"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold hover:bg-purple-500/25 transition-all cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                <Shield size={14} />
                <span>Admin CMS Panel</span>
              </a>

              <a
                href="https://drive.google.com/file/d/1I_yOQ82k2LqFINo5RuR_tXVEzzwAZkGx/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center text-xs py-3"
                onClick={() => setMenuOpen(false)}
              >
                <Download size={15} />
                <span>Download Resume</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
