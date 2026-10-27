import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Workstation3DScene from './Workstation3DScene';
import SojibOSDesktop from './SojibOSDesktop';
import { Sparkles, Monitor, Layers, ArrowDown } from 'lucide-react';

export default function WorkstationHero() {
  const [viewMode, setViewMode] = useState<'3d-room' | 'screen-os'>('3d-room');

  const scrollToClassic = () => {
    const el = document.getElementById('about') || document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#7C3AED]/15 via-[#06B6D4]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10 space-y-6">
        
        {/* Top Header Badge & Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center font-black text-sm text-white shadow-lg">
              SA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black uppercase tracking-tight text-white">Sojib Ahmed</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  Full Stack Developer
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Interactive 3D Workstation & Virtual OS Studio · Rangpur, Bangladesh
              </p>
            </div>
          </div>

          {/* Mode Switcher Pill */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#090D1A] border border-white/10 shadow-lg">
            <button
              onClick={() => setViewMode('3d-room')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === '3d-room'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor size={14} />
              <span>3D Room Studio</span>
            </button>

            <button
              onClick={() => setViewMode('screen-os')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'screen-os'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles size={14} />
              <span>Sojib OS Screen</span>
            </button>

            <button
              onClick={scrollToClassic}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-all hidden md:flex items-center gap-1.5 cursor-pointer"
              title="Scroll down to classic view"
            >
              <Layers size={13} />
              <span>Classic View ↓</span>
            </button>
          </div>
        </div>

        {/* The Main Workstation Stage */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {viewMode === '3d-room' ? (
              <motion.div
                key="3d-room"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Workstation3DScene
                  isZoomed={false}
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
              >
                <SojibOSDesktop
                  onZoomOut={() => setViewMode('3d-room')}
                  onScrollToClassic={scrollToClassic}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Prompt to Scroll */}
        <div className="text-center pt-2">
          <button
            onClick={scrollToClassic}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#06B6D4] transition-colors cursor-pointer"
          >
            <span>Or explore standard portfolio breakdown</span>
            <ArrowDown size={14} className="animate-bounce text-[#06B6D4]" />
          </button>
        </div>

      </div>
    </section>
  );
}
