import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Workstation3DScene from './Workstation3DScene';
import SojibOSDesktop from './SojibOSDesktop';
import { Sparkles, Monitor, Layers, Volume2, VolumeX, Shield, Terminal, ArrowDown, Mail, FileText } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';

interface WorkstationHeroProps {
  onSwitchToClassic?: () => void;
}

export default function WorkstationHero({ onSwitchToClassic }: WorkstationHeroProps) {
  const [viewMode, setViewMode] = useState<'3d-room' | 'screen-os'>('3d-room');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPlayingLofi, setIsPlayingLofi] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Real Lofi Chill Audio Track Player
  useEffect(() => {
    const audio = new Audio('/audio/lofi-song.mp3');
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    audio.onended = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const toggleLofiMusic = () => {
    if (!audioRef.current) return;

    if (isPlayingLofi) {
      audioRef.current.pause();
      setIsPlayingLofi(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingLofi(true);
      }).catch((err) => {
        console.warn('Audio play blocked by browser policy:', err);
        setIsPlayingLofi(false);
      });
    }
  };

  const scrollToClassic = () => {
    if (onSwitchToClassic) {
      onSwitchToClassic();
    } else {
      const el = document.getElementById('about') || document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative w-full min-h-screen bg-[#030712] flex flex-col justify-between overflow-hidden pt-20 pb-6 px-3 sm:px-6">
      
      {/* Background Cyber Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#7C3AED]/20 via-[#06B6D4]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Floating Master Control HUD */}
      <div className="relative z-30 max-w-7xl mx-auto w-full mb-3 sm:mb-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand / Profile Card with Sojib's Real Photo & Links Placed Directly Beneath His Picture */}
        <div className="flex flex-col gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="relative group flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-[#7C3AED] via-[#06B6D4] to-[#10B981] shadow-lg shadow-[#06B6D4]/25">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#050B17]">
                  <img
                    src="/images/hero.jpg"
                    alt="Sojib Ahmed - Full Stack Developer"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#030712] shadow-sm animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-white leading-none">
                  Sojib Ahmed
                </h1>
                <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Available for Hire
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
                <span className="text-[#06B6D4] font-semibold">Full Stack Developer</span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-300">Production Systems Architect</span>
              </p>
            </div>
          </div>

          {/* Quick Connect Links DIRECTLY UNDERNEATH Picture (GitHub, LinkedIn, Email, WhatsApp, Resume) */}
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <a
              href="https://github.com/SojibTechHub"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-200 hover:text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 cursor-pointer"
              title="GitHub Profile"
            >
              <FaGithub size={13} className="text-white" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/sojib-ahmed-shorif"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-[#0077B5]/15 hover:bg-[#0077B5]/25 border border-[#0077B5]/35 text-[#38BDF8] hover:text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 cursor-pointer"
              title="LinkedIn Profile"
            >
              <FaLinkedinIn size={12} />
              <span>LinkedIn</span>
            </a>

            <a
              href="mailto:sojibahmedshorif998@gmail.com"
              className="px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/35 text-purple-300 hover:text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 cursor-pointer"
              title="Email: sojibahmedshorif998@gmail.com"
            >
              <Mail size={12} />
              <span>Email</span>
            </a>

            <a
              href="https://wa.me/8801942791004"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/35 text-[#4ADE80] hover:text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 cursor-pointer"
              title="WhatsApp: +8801942791004"
            >
              <FaWhatsapp size={13} />
              <span>WhatsApp</span>
            </a>

            <a
              href="https://drive.google.com/file/d/1I_yOQ82k2LqFINo5RuR_tXVEzzwAZkGx/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#06B6D4]/20 to-[#10B981]/20 hover:from-[#06B6D4]/35 hover:to-[#10B981]/35 border border-[#06B6D4]/40 text-[#22D3EE] hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 cursor-pointer"
              title="View & Download Official Full-Stack Resume"
            >
              <FileText size={12} />
              <span>Resume</span>
            </a>

            {/* CMS Admin Link */}
            <a
              href="/admin"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-xl bg-[#090D1A] hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 border border-white/10 transition-all hover:scale-105"
              title="Admin CMS Dashboard"
            >
              <Shield size={13} />
            </a>
          </div>
        </div>

        {/* Master Action & Mode Switcher Controls */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto">
          {/* Lofi Audio Player Toggle */}
          <button
            onClick={toggleLofiMusic}
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm ${
              isPlayingLofi
                ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-[#090D1A] text-gray-300 border-white/10 hover:text-white'
            }`}
            title="Toggle Lofi Ambient Coding Music"
          >
            {isPlayingLofi ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
            <span>{isPlayingLofi ? 'Lofi Audio: ON 🎵' : 'Play Lofi Audio 🎧'}</span>
          </button>

          {/* 3D Room / Virtual OS Screen Switch */}
          <div className="flex items-center p-1 rounded-xl bg-[#090D1A] border border-white/10 shadow-md">
            <button
              onClick={() => { setViewMode('3d-room'); setIsZoomed(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === '3d-room'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor size={13} />
              <span>3D Room Studio</span>
            </button>

            <button
              onClick={() => setViewMode('screen-os')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'screen-os'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles size={13} />
              <span>Sojib OS Desktop</span>
            </button>
          </div>

          {/* Classic Scroll View Switch */}
          <button
            onClick={scrollToClassic}
            className="px-3 py-1.5 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Switch to Classic Scroll Portfolio"
          >
            <Layers size={13} className="text-[#06B6D4]" />
            <span>Classic View ↓</span>
          </button>

          {/* CMS Admin Link on desktop */}
          <a
            href="/admin"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex p-2 rounded-xl bg-[#090D1A] hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 border border-white/10 transition-all"
            title="Admin CMS"
          >
            <Shield size={16} />
          </a>
        </div>
      </div>

      {/* The Central 3D Workstation Stage */}
      <div className="relative flex-1 max-w-7xl mx-auto w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {viewMode === '3d-room' ? (
            <motion.div
              key="3d-room"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              <Workstation3DScene
                isZoomed={isZoomed}
                onToggleZoom={() => setIsZoomed(!isZoomed)}
                onMonitorClick={() => setViewMode('screen-os')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="screen-os"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              <SojibOSDesktop
                onZoomOut={() => setViewMode('3d-room')}
                onScrollToClassic={scrollToClassic}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Hint Bar */}
      <div className="relative z-20 max-w-7xl mx-auto w-full pt-3 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-gray-500 gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Terminal size={12} className="text-[#06B6D4]" />
          <span>Tip: Tap or click monitor to launch Sojib OS, or tap Zoom to inspect screen</span>
        </div>

        <button
          onClick={scrollToClassic}
          className="hover:text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Scroll down for traditional section breakdown</span>
          <ArrowDown size={12} className="text-[#06B6D4] animate-bounce" />
        </button>
      </div>

    </section>
  );
}
