import { motion } from 'framer-motion';
import { ArrowUp, ChevronRight, Shield } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaWhatsapp, FaFacebookF, FaEnvelope } from 'react-icons/fa6';

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/sojibahmedshorif25-ai', label: 'GitHub' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/sojib-ahmed-shorif', label: 'LinkedIn' },
  { icon: FaWhatsapp, href: 'https://wa.me/8801942791004', label: 'WhatsApp' },
  { icon: FaFacebookF, href: 'https://www.facebook.com/share/16G2SwmtSFk/', label: 'Facebook' },
  { icon: FaEnvelope, href: 'mailto:sojibahmedshorif998@gmail.com', label: 'Email' },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#030712] pt-16 pb-12 sm:pt-20 sm:pb-14 border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Brand & Bio (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#06B6D4]/60 p-[2px] bg-[#0B1120] flex-shrink-0 shadow-md">
                <img
                  src="/images/hero.jpg"
                  alt="Sojib Ahmed"
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>
              <div>
                <div className="font-extrabold text-lg tracking-wide text-white uppercase leading-none">
                  SOJIB AHMED<span className="text-[#06B6D4]">.</span>
                </div>
                <div className="text-xs font-semibold text-[#06B6D4] tracking-wide mt-1.5">
                  Full Stack Developer
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed max-w-sm pt-1">
              Full Stack Developer focused on building scalable, high-performance, and user-focused web applications with modern technologies.
            </p>
          </div>

          {/* Middle Column: Quick Links (3 cols) */}
          <div className="md:col-span-3 md:pl-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                QUICK LINKS
              </h3>
            </div>

            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="flex items-center gap-2 text-xs sm:text-sm text-[#9CA3AF] hover:text-[#06B6D4] hover:translate-x-1 transition-all duration-200 text-left cursor-pointer"
                  >
                    <ChevronRight size={13} className="text-[#64748B]" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Stay Connected & Info (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                STAY CONNECTED
              </h3>
            </div>

            {/* Social Icons Row */}
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-[#0B1120] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#06B6D4] hover:bg-[rgba(6,182,212,0.15)] transition-all shadow-sm"
                  aria-label={label}
                  title={label}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>

            {/* Contact Details List */}
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-[#D1D5DB]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] flex-shrink-0" />
                <span className="font-bold text-white min-w-[75px]">E-mail:</span>
                <a
                  href="mailto:sojibahmedshorif998@gmail.com"
                  className="text-[#9CA3AF] hover:text-[#06B6D4] transition-colors break-all"
                >
                  sojibahmedshorif998@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] flex-shrink-0" />
                <span className="font-bold text-white min-w-[75px]">Phone:</span>
                <a href="tel:+8801942791004" className="text-[#9CA3AF] hover:text-[#06B6D4] transition-colors">
                  +880 1942791004
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] flex-shrink-0" />
                <span className="font-bold text-white min-w-[75px]">WhatsApp:</span>
                <a
                  href="https://wa.me/8801942791004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9CA3AF] hover:text-[#06B6D4] transition-colors"
                >
                  +880 1942791004
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] flex-shrink-0" />
                <span className="font-bold text-white min-w-[75px]">GitHub:</span>
                <a
                  href="https://github.com/sojibahmedshorif25-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9CA3AF] hover:text-[#06B6D4] transition-colors"
                >
                  sojibahmedshorif25-ai
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar with Back to Top button & Admin link */}
        <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">
            Â© {new Date().getFullYear()} Sojib Ahmed. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="text-xs text-gray-500 hover:text-[#06B6D4] transition-colors flex items-center gap-1.5"
              title="Admin Control Panel"
            >
              <Shield size={12} className="text-purple-400" />
              <span>Admin CMS</span>
            </a>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="px-4 py-2 rounded-full bg-[#0B1120] border border-[rgba(255,255,255,0.12)] text-xs font-semibold text-[#9CA3AF] hover:text-white hover:border-[#06B6D4] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp size={12} className="text-[#06B6D4]" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
