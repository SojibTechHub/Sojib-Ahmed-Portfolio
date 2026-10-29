import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Workstation3DScene from './Workstation3DScene';
import SojibOSDesktop from './SojibOSDesktop';
import { Sparkles, Monitor, Layers, Volume2, VolumeX, Shield, Terminal, ArrowDown } from 'lucide-react';

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
      // Loop backup
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
        
        {/* Brand / Profile Header */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#06B6D4] to-[#10B981] p-[2px] shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-[#050B17] rounded-[14px] flex items-center justify-center font-black text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#22D3EE]">
                SA
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-white leading-none">
                  Sojib Ahmed
                </h1>
                <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Available for Hire
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                <span className="text-[#06B6D4] font-semibold">Full Stack Developer</span>
                <span>·</span>
                <span className="hidden xs:inline">Interactive 3D Workstation Studio</span>
              </p>
            </div>
          </div>

          {/* CMS Admin Link on mobile */}
          <a
            href="/admin"
            target="_blank"
            rel="noreferrer"
            className="md:hidden p-2 rounded-xl bg-[#090D1A] hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 border border-white/10 transition-all"
            title="Admin CMS"
          >
            <Shield size={15} />
          </a>
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
