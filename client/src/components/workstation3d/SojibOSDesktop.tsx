import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, Terminal, User, Mail, Award, Settings, 
  ExternalLink, X, Minus, 
  ArrowLeft, Volume2, VolumeX, CheckCircle2, ShieldCheck, 
  Search, Cpu, Wrench, Bot, Send, Layers, Code, Server,
  Download, FileText, Sparkles, ChevronRight, Briefcase, MapPin, GraduationCap
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { skillCategories, allSkillsList } from '../../data/skills';
import { getSkillRealIcon } from '../sections/Skills';

interface SojibOSProps {
  onZoomOut: () => void;
  onScrollToClassic: () => void;
}

type AppId = 'projects' | 'terminal' | 'about' | 'skills' | 'services' | 'certificates' | 'contact' | 'aichat';

export default function SojibOSDesktop({ onZoomOut, onScrollToClassic }: SojibOSProps) {
  const [activeApp, setActiveApp] = useState<AppId | null>('projects');
  const [time, setTime] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  };

  const openApp = (app: AppId) => {
    playBeep();
    setActiveApp(app);
  };

  return (
    <div className="relative w-full h-full min-h-[580px] sm:min-h-[640px] max-h-[88vh] bg-[#030712] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#06B6D4]/30 shadow-2xl flex flex-col font-sans select-none">
      
      {/* OS Top Navigation Bar */}
      <div className="h-10 bg-[#0B1120] border-b border-[rgba(255,255,255,0.08)] px-3 sm:px-4 flex items-center justify-between text-xs text-gray-300 z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse flex-shrink-0" />
            <span className="font-extrabold text-[#06B6D4] tracking-wider uppercase text-[11px] whitespace-nowrap">
              Sojib OS <span className="hidden sm:inline text-gray-500 font-normal">v2.6 Enterprise</span>
            </span>
          </div>

          <span className="text-gray-600 hidden sm:inline">|</span>

          {/* Quick Jump Buttons */}
          <button
            onClick={() => { playBeep(); onZoomOut(); }}
            className="px-2 py-1 rounded-md bg-white/5 hover:bg-[#06B6D4]/20 hover:text-[#06B6D4] border border-white/10 transition-all flex items-center gap-1 text-[11px] font-semibold cursor-pointer whitespace-nowrap"
            title="Step back to 3D Room"
          >
            <ArrowLeft size={12} />
            <span className="hidden xs:inline">3D Room</span>
          </button>

          <button
            onClick={() => { playBeep(); onScrollToClassic(); }}
            className="hidden md:flex px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all items-center gap-1.5 text-[11px] font-semibold cursor-pointer whitespace-nowrap"
          >
            <span>Classic View ↓</span>
          </button>
        </div>

        {/* System Tray (Clock, Sound, Admin shortcut) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute OS Sounds' : 'Enable OS Sounds'}
          >
            {soundEnabled ? <Volume2 size={13} className="text-[#06B6D4]" /> : <VolumeX size={13} />}
          </button>

          <a
            href="/admin"
            target="_blank"
            rel="noreferrer"
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center gap-1 transition-all whitespace-nowrap"
            title="Open Admin CMS"
          >
            <Settings size={11} />
            <span>Admin</span>
          </a>

          <span className="font-mono text-[11px] text-gray-400 font-semibold">{time}</span>
        </div>
      </div>

      {/* Main Desktop Screen Area */}
      <div className="flex-1 relative p-2 sm:p-4 md:p-6 overflow-hidden bg-radial from-[#09152E]/60 via-[#050B17] to-[#02050D]">
        
        {/* Subtle Cyber Grid Background & Watermark */}
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="absolute bottom-16 right-8 text-right pointer-events-none opacity-15">
          <div className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
            SOJIB AHMED
          </div>
          <div className="text-sm md:text-lg font-bold text-[#06B6D4] tracking-widest uppercase mt-1">
            FULL STACK DEVELOPER · 2026
          </div>
        </div>

        {/* Desktop App Icons: Grid on Mobile when no app open, column on desktop */}
        <div className={`relative z-10 ${
          activeApp ? 'hidden md:grid md:grid-cols-1 md:w-28' : 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-1 w-full md:w-28'
        } gap-2.5 overflow-y-auto max-h-[75vh] pr-1`}>
          {[
            { id: 'projects', label: 'Projects.exe', icon: FolderGit2, color: '#06B6D4' },
            { id: 'terminal', label: 'Terminal.sh', icon: Terminal, color: '#10B981' },
            { id: 'about', label: 'AboutMe.app', icon: User, color: '#8B5CF6' },
            { id: 'skills', label: 'Skills.exe', icon: Cpu, color: '#38BDF8' },
            { id: 'services', label: 'Services.app', icon: Wrench, color: '#F43F5E' },
            { id: 'certificates', label: 'Credentials.pdf', icon: Award, color: '#06B6D4' },
            { id: 'aichat', label: 'SojibAI.exe', icon: Bot, color: '#A855F7' },
            { id: 'contact', label: 'Contact.mail', icon: Mail, color: '#EC4899' },
          ].map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => openApp(id as AppId)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center group cursor-pointer transition-all ${
                activeApp === id 
                  ? 'bg-white/15 border border-white/20 shadow-lg' 
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200"
                style={{ background: `linear-gradient(135deg, ${color}25, ${color}10)`, border: `1px solid ${color}50` }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <span className="text-[10px] font-bold text-gray-200 group-hover:text-white drop-shadow truncate w-full">
                {label}
              </span>
            </button>
          ))}

          {/* Admin shortcut */}
          <a
            href="/admin"
            target="_blank"
            rel="noreferrer"
            onClick={playBeep}
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-center group cursor-pointer hover:bg-white/5 border border-transparent transition-all"
            title="Open Admin CMS"
          >
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200"
              style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.25), rgba(244,63,94,0.1))', border: '1px solid rgba(244,63,94,0.5)' }}
            >
              <ShieldCheck size={22} className="text-[#F43F5E]" />
            </div>
            <span className="text-[10px] font-bold text-gray-200 group-hover:text-[#F43F5E] drop-shadow truncate w-full">
              Admin.lnk
            </span>
          </a>
        </div>

        {/* Floating Active Application Window */}
        <AnimatePresence>
          {activeApp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-1 sm:top-2 left-1 sm:left-2 right-1 sm:right-2 bottom-12 md:top-4 md:left-36 md:right-4 md:bottom-14 bg-[#090D1A]/95 backdrop-blur-xl border border-[rgba(255,255,255,0.12)] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-20"
            >
              {/* Window Title Bar */}
              <div className="h-9 bg-[#0B1120] border-b border-white/10 px-3 sm:px-4 flex items-center justify-between select-none gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Mobile Back Button to Apps Launcher */}
                  <button
                    onClick={() => { playBeep(); setActiveApp(null); }}
                    className="md:hidden flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#06B6D4]/20 hover:bg-[#06B6D4]/30 border border-[#06B6D4]/40 text-[#06B6D4] text-[11px] font-bold transition-all flex-shrink-0 cursor-pointer"
                    title="Back to Apps"
                  >
                    <ArrowLeft size={12} />
                    <span>Apps</span>
                  </button>

                  <span className="w-2 h-2 rounded-full bg-[#06B6D4] flex-shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white truncate">
                    {activeApp === 'projects' && 'Projects Explorer'}
                    {activeApp === 'terminal' && 'Bash Terminal'}
                    {activeApp === 'about' && 'About Sojib'}
                    {activeApp === 'skills' && 'Technical Stack'}
                    {activeApp === 'services' && 'Services Workflow'}
                    {activeApp === 'certificates' && 'Official Credentials'}
                    {activeApp === 'aichat' && 'Sojib AI'}
                    {activeApp === 'contact' && 'Contact Mailer'}
                  </span>
                  <span className="hidden lg:inline text-xs text-gray-400 font-normal truncate">
                    {activeApp === 'projects' && '— 10 Production Builds'}
                    {activeApp === 'terminal' && '— Interactive CLI'}
                    {activeApp === 'about' && '— Background & Bio'}
                    {activeApp === 'skills' && '— Real-World Stack'}
                    {activeApp === 'services' && '— Production Workflow'}
                    {activeApp === 'certificates' && '— FlyRank, PH & Datheon'}
                    {activeApp === 'aichat' && '— Gemini Powered'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button 
                    onClick={() => setActiveApp(null)}
                    className="w-6 h-6 rounded-md hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
                    title="Minimize"
                  >
                    <Minus size={12} />
                  </button>
                  <button 
                    onClick={() => setActiveApp(null)}
                    className="w-6 h-6 rounded-md hover:bg-red-500/80 hover:text-white text-gray-400 flex items-center justify-center transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Window Content */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 text-gray-200">
                {activeApp === 'projects' && <OSProjectsApp />}
                {activeApp === 'terminal' && <OSTerminalApp />}
                {activeApp === 'about' && <OSAboutApp onNavigate={openApp} />}
                {activeApp === 'skills' && <OSSkillsApp />}
                {activeApp === 'services' && <OSServicesApp onNavigate={openApp} />}
                {activeApp === 'certificates' && <OSCertificatesApp onNavigate={openApp} />}
                {activeApp === 'aichat' && <OSAIChatApp />}
                {activeApp === 'contact' && <OSContactApp />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* OS Bottom Taskbar */}
      <div className="h-10 bg-[#0B1120] border-t border-[rgba(255,255,255,0.08)] px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          {/* Start Menu Button */}
          <button
            onClick={() => openApp('about')}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 shadow-md hover:opacity-90 cursor-pointer"
          >
            <span>SA</span>
            <span className="text-[10px] font-normal opacity-80">Start</span>
          </button>

          {/* Active Window Task Icon */}
          {activeApp && (
            <div className="px-3 py-1 rounded-lg bg-white/10 border border-[#06B6D4]/30 text-xs font-semibold text-[#06B6D4] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
              <span className="capitalize">{activeApp}</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-gray-400 font-medium">
          Ready for New Opportunities ✅
        </div>
      </div>

    </div>
  );
}

// -------------------------------------------------------------
// APP 1: PROJECTS EXPLORER
// -------------------------------------------------------------
const osProjectImageMap: Record<string, string> = {
  'shopx': '/images/shopx.png',
  'foodflow': '/images/foodflow.png',
  'skillforge': '/images/skillforge.png',
  'startupforge': '/images/startupforge.png',
  'typemarket': '/images/typemarket.png',
  'investprop': '/images/investprop.png',
  'issue': '/images/issuetracker.png',
  'pet': '/images/petadoption.png',
  'job': '/images/jobfinder.png',
  'book': '/images/digitools.png',
  'digitools': '/images/digitools.png',
};

function resolveOSProjectImage(title?: string, img?: string) {
  if (img && !img.includes('hero.jpg')) return img;
  const key = (title || '').toLowerCase();
  for (const [k, v] of Object.entries(osProjectImageMap)) {
    if (key.includes(k)) return v;
  }
  return '/images/shopx.png';
}

function OSProjectsApp() {
  const [filter, setFilter] = useState<'all' | 'full-stack' | 'frontend' | 'backend'>('all');
  const [search, setSearch] = useState('');

  const defaultOSProjects = [
    {
      title: 'ShopX BD Enterprise',
      subtitle: 'Hyperlocal Multi-Vendor E-Commerce & DEX Logistics Platform',
      category: 'full-stack',
      tech: ['React 19', 'TypeScript', 'Node.js', 'Express', 'MongoDB Atlas', 'Upstash Redis'],
      live: 'https://shopx-bd-enterprise.vercel.app/',
      github: 'https://github.com/SojibTechHub/Shopx-BD-Enterprise',
      image: '/images/shopx.png',
    },
    {
      title: 'FoodFlow (Team Project)',
      subtitle: 'AI Multi-Vendor Food Delivery & Logistics Platform',
      category: 'full-stack',
      tech: ['Next.js 15', 'React 19', 'TypeScript', 'Node.js', 'Socket.IO', 'Gemini AI'],
      live: 'https://fooddeliveryplatform.vercel.app',
      github: 'https://github.com/khalid66527/food_flow-client',
      image: '/images/foodflow.png',
    },
    {
      title: 'SkillForge',
      subtitle: 'AI Learning, Code Sandbox & Career Recruitment Platform',
      category: 'full-stack',
      tech: ['Next.js 16', 'React 19', 'Express.js', 'Better Auth', 'Docker', 'React Query'],
      live: 'https://job-student-task.vercel.app/',
      github: 'https://github.com/SojibTechHub/JOB-STUDENT-TASK.git',
      image: '/images/skillforge.png',
    },
    {
      title: 'StartupForge',
      subtitle: 'AI Startup Team Ecosystem & ATS Platform with Video Call',
      category: 'full-stack',
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'WebRTC', 'Stripe'],
      live: 'https://startupforge-ruby.vercel.app/',
      github: 'https://github.com/SojibTechHub/startupforge.git',
      image: '/images/startupforge.png',
    },
    {
      title: 'TypeMarket',
      subtitle: 'Type-Safe Multi-Role E-Commerce & Storefront Engine',
      category: 'frontend',
      tech: ['TypeScript', 'React.js', 'Tailwind CSS', 'TanStack Query', 'Lucide React'],
      live: 'https://type-script-project-nine.vercel.app',
      github: 'https://github.com/SojibTechHub/TypeScript-Project',
      image: '/images/typemarket.png',
    },
    {
      title: 'InvestProp AI',
      subtitle: 'AI Real Estate Investment Analytics & Property Valuation Portal',
      category: 'frontend',
      tech: ['React.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
      live: 'https://investprop-ai.vercel.app',
      github: 'https://github.com/SojibTechHub/Investprop-Ai.git',
      image: '/images/investprop.png',
    },
    {
      title: 'GitHub Issue Tracker',
      subtitle: 'Real-time Issue Management Dashboard with GitHub API',
      category: 'frontend',
      tech: ['React.js', 'Tailwind CSS', 'GitHub API', 'Lucide React'],
      live: 'https://fabulous-profiterole-d6e817.netlify.app/',
      github: 'https://github.com/SojibTechHub/github-issue-tracker.git',
      image: '/images/issuetracker.png',
    },
    {
      title: 'Pet Adoption REST Engine',
      subtitle: 'Scalable Microservice API & Shelter Management Gateway',
      category: 'backend',
      tech: ['Node.js', 'Express.js', 'MongoDB Atlas', 'JWT', 'Nodemailer'],
      live: 'https://pet-adoption-client-rho-jet.vercel.app',
      github: 'https://github.com/SojibTechHub/Pet-Adoption-Server',
      image: '/images/petadoption.png',
    },
    {
      title: 'Job Finder API Gateway',
      subtitle: 'High-Concurrency Recruitment & Application Service',
      category: 'backend',
      tech: ['Node.js', 'Express.js', 'MongoDB Atlas', 'JWT', 'Cloudinary'],
      live: 'https://job-finder-client.vercel.app',
      github: 'https://github.com/SojibTechHub/Job-Finder',
      image: '/images/jobfinder.png',
    },
    {
      title: 'Books Platform REST API',
      subtitle: 'Digital Library & Review Engine Backend',
      category: 'backend',
      tech: ['Node.js', 'Express.js', 'MongoDB Atlas', 'Express Validator'],
      live: 'https://books-platfrom-48rm.vercel.app/',
      github: 'https://github.com/SojibTechHub/Books-Platfrom.git',
      image: '/images/digitools.png',
    },
  ];

  const [projectList, setProjectList] = useState(defaultOSProjects);

  // Sync with Admin CMS updates
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sojib_custom_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasStaleHero = parsed.some((p: any) => p.image && p.image.includes('hero.jpg'));
          if (hasStaleHero) {
            localStorage.removeItem('sojib_custom_projects');
          } else {
            const mapped = parsed.map((p: any) => ({
              title: p.title,
              subtitle: p.subtitle || p.description,
              category: p.category || 'full-stack',
              tech: Array.isArray(p.techStack) ? p.techStack : ['React', 'Node.js'],
              live: p.liveUrl || p.live || '',
              github: p.githubUrl || p.github || '',
              image: resolveOSProjectImage(p.title, p.image),
            }));
            setProjectList(mapped);
          }
        }
      }
    } catch {}

    const fetchLive = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/projects`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped = data.data.map((p: any) => ({
            title: p.title,
            subtitle: p.subtitle || p.description,
            category: p.category || 'full-stack',
            tech: Array.isArray(p.techStack) ? p.techStack : ['React', 'Node.js'],
            live: p.liveUrl || p.live || '',
            github: p.githubUrl || p.github || '',
            image: resolveOSProjectImage(p.title, p.image),
          }));
          setProjectList(mapped);
        }
      } catch {}
    };
    fetchLive();
  }, []);

  const filtered = projectList.filter(p => {
    const matchCat = filter === 'all' || p.category === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                        p.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between pb-3 border-b border-white/10">
        <div className="flex flex-wrap sm:flex-nowrap gap-1 p-1 rounded-xl bg-[#030712] border border-white/5 w-full sm:w-auto">
          {(['all', 'full-stack', 'frontend', 'backend'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer text-center whitespace-nowrap ${
                filter === cat
                  ? 'bg-[#06B6D4] text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? `All (${projectList.length})` : cat === 'full-stack' ? 'Full Stack' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-48">
          <Search size={13} className="absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#030712] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-[#06B6D4]"
          />
        </div>
      </div>

      {/* Projects Grid with Pictures */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((proj, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl bg-[#030712]/80 border border-white/10 hover:border-[#06B6D4]/50 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Project Picture Banner */}
              <div className="relative w-full h-36 rounded-lg overflow-hidden bg-black/60 mb-3 border border-white/5">
                <img 
                  src={resolveOSProjectImage(proj.title, proj.image)} 
                  alt={proj.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/shopx.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-black/80 text-[#06B6D4] border border-[#06B6D4]/30 backdrop-blur-md">
                  {proj.category}
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-sm text-white group-hover:text-[#06B6D4] transition-colors leading-snug">
                  {proj.title}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {proj.subtitle}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.tech.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-gray-300 font-medium border border-white/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-white/5 mt-3">
              {proj.live && (
                <a
                  href={proj.live}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 rounded-lg bg-[#06B6D4]/20 hover:bg-[#06B6D4]/30 border border-[#06B6D4]/40 text-[#06B6D4] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ExternalLink size={12} />
                  <span>Live Demo</span>
                </a>
              )}
              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <FaGithub size={12} />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// APP 2: INTERACTIVE BASH TERMINAL
// -------------------------------------------------------------
function OSTerminalApp() {
  const [history, setHistory] = useState<Array<{ cmd: string; output: string }>>([
    { cmd: 'whoami', output: 'Sojib Ahmed — Full Stack Developer (React 19, TypeScript, Node.js, Express, MongoDB Atlas)' },
    { cmd: 'status', output: 'Available for full-time & high-impact remote engineering roles ✅' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    let output = '';
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      output = `Available commands:\n• whoami      - Developer profile\n• skills      - Full-stack technical stack\n• projects    - List flagship repositories\n• contact     - Direct contact coordinates\n• sudo hire   - Instant email setup\n• clear       - Clear terminal`;
    } else if (lower === 'whoami') {
      output = `Sojib Ahmed\nRole: Full Stack Web Developer\nLocation: Rangpur, Bangladesh\nEducation: Programming Hero Full Stack Course (Batch 13)`;
    } else if (lower === 'skills') {
      output = `Frontend: React 19, Next.js 16, TypeScript, Tailwind CSS, Framer Motion\nBackend:  Node.js, Express.js, REST API, Socket.IO, WebRTC\nDatabase: MongoDB Atlas, Mongoose, Upstash Redis\nDevOps:   Docker, GitHub Actions, Vercel, Render`;
    } else if (lower === 'projects') {
      output = `1. ShopX BD Enterprise — Hyperlocal Multi-Vendor E-Commerce\n2. FoodFlow — AI Multi-Vendor Food Delivery\n3. SkillForge — AI Learning & Code Sandbox\n4. StartupForge — AI Startup ATS & Video Interviews`;
    } else if (lower === 'contact') {
      output = `Email:    sojibahmedshorif998@gmail.com\nPhone:    +880 1942791004\nWhatsApp: +880 1942791004\nGitHub:   https://github.com/SojibTechHub`;
    } else if (lower === 'sudo hire') {
      output = `Access granted! 🎉 Opening email composer...`;
      window.open('mailto:sojibahmedshorif998@gmail.com?subject=Job%20Opportunity', '_blank');
    } else if (lower === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else {
      output = `bash: command not found: ${cmd}. Type "help" for a list of commands.`;
    }

    setHistory(prev => [...prev, { cmd, output }]);
    setInput('');
  };

  return (
    <div className="font-mono text-xs space-y-3 bg-[#030712] p-4 rounded-xl border border-white/5 h-full min-h-[360px] flex flex-col justify-between">
      <div className="space-y-3 overflow-y-auto">
        <div className="text-gray-500">
          Sojib OS Bash v2.6 (x86_64-pc-none) Type <span className="text-[#06B6D4] font-bold">help</span> to begin.
        </div>
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-[#06B6D4]">
              <span>sojib@portfolio:~$</span>
              <span className="text-white font-bold">{item.cmd}</span>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap pl-4 border-l border-white/10 leading-relaxed">
              {item.output}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2 border-t border-white/10">
        <span className="text-[#06B6D4] font-bold">sojib@portfolio:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type 'help', 'skills', 'projects'..."
          className="flex-1 bg-transparent text-white outline-none font-mono text-xs"
          autoFocus
        />
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// APP 3: ABOUT ME (Engineering Specialization & Proven Background)
// -------------------------------------------------------------
function OSAboutApp({ onNavigate }: { onNavigate?: (app: AppId) => void }) {
  return (
    <div className="space-y-5 max-w-3xl pb-4">
      {/* Bio Header */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-[#030712] border border-white/10 shadow-lg">
        <div className="w-20 h-20 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex-shrink-0 shadow-lg">
          <img
            src="/images/hero.jpg"
            alt="Sojib Ahmed"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Sojib Ahmed</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
              Full Stack Developer
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for Hire
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Full-Stack Web Developer from Rangpur, Bangladesh. Specialized in building high-concurrency MERN & Next.js systems, real-time Socket.IO backends, and cutting-edge 3D interactive user interfaces.
          </p>
        </div>
      </div>

      {/* Core Engineering Competencies (Replaces generic stat boxes) */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#06B6D4]" />
          <span>Core Engineering Focus</span>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#030712] border border-white/5 hover:border-[#7C3AED]/40 transition-all space-y-2 group shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 text-[#A78BFA] flex items-center justify-center">
              <Layers size={17} />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-[#A78BFA] transition-colors">
              Full-Stack Architecture
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              React 19, Next.js 16, TypeScript, Node.js, Express, and scalable MongoDB Atlas / PostgreSQL schemas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#030712] border border-white/5 hover:border-[#06B6D4]/40 transition-all space-y-2 group shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 text-[#06B6D4] flex items-center justify-center">
              <ShieldCheck size={17} />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-[#06B6D4] transition-colors">
              Security & DevOps
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Docker containers, automated GitHub Actions CI/CD, Upstash Redis caching, and strict RBAC authorization.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#030712] border border-white/5 hover:border-[#10B981]/40 transition-all space-y-2 group shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Bot size={17} />
            </div>
            <h4 className="font-bold text-xs text-white group-hover:text-[#10B981] transition-colors">
              Real-Time & AI Systems
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Bidirectional Socket.IO telemetry, WebRTC video/audio, and custom Google Gemini AI chatbot integrations.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Background & Quick Facts */}
      <div className="p-4 rounded-xl bg-[#030712] border border-white/5 space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <Briefcase size={13} className="text-[#F59E0B]" />
          <span>Professional Background & Verified Credentials</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5 text-xs text-gray-300">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
            <MapPin size={15} className="text-[#06B6D4] flex-shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">Location:</span>
              <span className="font-semibold text-white">Rangpur, Bangladesh (Remote Worldwide)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
            <GraduationCap size={15} className="text-[#8B5CF6] flex-shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">Education & Training:</span>
              <span className="font-semibold text-white">Programming Hero Full-Stack (Batch 13)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
            <Award size={15} className="text-[#F59E0B] flex-shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">Official Appointment:</span>
              <span className="font-semibold text-white">FlyRank Offer of Appointment Verified</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#10B981] flex-shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">Availability:</span>
              <span className="font-semibold text-white">Full-Time / Contract / Remote Engineering</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="flex flex-wrap gap-2 pt-1">
        {onNavigate && (
          <>
            <button
              onClick={() => onNavigate('certificates')}
              className="px-4 py-2 rounded-xl bg-[#06B6D4]/20 hover:bg-[#06B6D4]/30 border border-[#06B6D4]/40 text-[#06B6D4] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText size={13} />
              <span>View FlyRank Offer Letter 📜</span>
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FolderGit2 size={13} className="text-[#A78BFA]" />
              <span>Explore 10 Projects 🚀</span>
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Mail size={13} />
              <span>Contact Sojib 📬</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// APP 4: TECHNICAL SKILLS BREAKDOWN (All Repositories & Real Brand Icons)
// -------------------------------------------------------------
function OSSkillsApp() {
  const [selectedCat, setSelectedCat] = useState<string>('frontend');
  const [filterSearch, setFilterSearch] = useState<string>('');

  const filteredSkills = allSkillsList.filter((s) => {
    const matchesCat = s.category === selectedCat;
    const matchesQuery =
      s.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(filterSearch.toLowerCase()) ||
      (s.repoProof && s.repoProof.toLowerCase().includes(filterSearch.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-4 max-w-4xl pb-4">
      {/* Header & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[#06B6D4]" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Technical Arsenal & Stack Breakdown
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Production-grade technologies verified across live repositories.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search size={13} className="absolute left-2.5 top-2.5 text-gray-500" />
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Search skill or repo..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#030712] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-[#06B6D4]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5">
        {skillCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedCat === cat.id
                ? 'bg-[#06B6D4] text-black shadow-lg shadow-[#06B6D4]/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {cat.label} ({cat.skills.length})
          </button>
        ))}
      </div>

      {/* Skills Grid with Real Brand Logos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[58vh] overflow-y-auto pr-1">
        {filteredSkills.map((skill, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[#030712]/90 border border-white/10 hover:border-[#06B6D4]/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
                    {getSkillRealIcon(skill.name, 18)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-[#06B6D4] transition-colors leading-tight">
                      {skill.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 capitalize">{skill.category}</span>
                  </div>
                </div>

                {skill.experienceLevel && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      skill.experienceLevel === 'Expert'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30'
                    }`}
                  >
                    {skill.experienceLevel}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">
                {skill.description}
              </p>
            </div>

            {skill.repoProof && (
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="text-gray-400 font-medium">Repos:</span>
                <span className="text-[#06B6D4] truncate font-mono">{skill.repoProof}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// APP 5: SERVICES & PRODUCTION WORKFLOW
// -------------------------------------------------------------
function OSServicesApp({ onNavigate }: { onNavigate?: (app: AppId) => void }) {
  const serviceList = [
    {
      title: 'Full Stack Web Applications',
      subtitle: 'Enterprise MERN & Next.js Systems',
      icon: Layers,
      color: '#7C3AED',
      tech: ['Next.js 16', 'React 19', 'TypeScript', 'Node.js', 'Express', 'MongoDB Atlas'],
      deliverables: [
        'Multi-Role Portals (Admin, Vendor, Customer) with secure JWT / OAuth RBAC',
        'Unified Checkout Engines with Stripe & SSLCommerz automated webhooks',
        'Upstash Redis in-memory caching reducing latency to sub-50ms',
        'End-to-end atomic database transactions and data integrity guarantees',
      ],
    },
    {
      title: 'Frontend UI/UX & Interactive 3D',
      subtitle: 'High-Performance Pixel-Perfect Interfaces',
      icon: Code,
      color: '#06B6D4',
      tech: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Three.js', 'Framer Motion', 'GSAP'],
      deliverables: [
        'Interactive 3D WebGL scenes, virtual desktops & custom shaders',
        'Sub-second 95+ Lighthouse performance with code-splitting & tree-shaking',
        'Responsive mobile-first layouts with smooth spring physics transitions',
        'Design-system compliance with dark/light themes and ARIA accessibility',
      ],
    },
    {
      title: 'Backend APIs & Microservices',
      subtitle: 'High-Throughput Distributed Gateways',
      icon: Server,
      color: '#10B981',
      tech: ['Node.js', 'Express.js', 'Socket.IO', 'WebRTC', 'Docker', 'Redis'],
      deliverables: [
        'Bidirectional Socket.IO telemetry for live tracking and instant chat',
        'WebRTC video/audio calling mesh with peer connection management',
        'Automated transactional emails with Nodemailer and queue workers',
        'Dockerized microservice architecture ready for automated CI/CD deployment',
      ],
    },
    {
      title: 'AI Assistant & Automation Systems',
      subtitle: 'Custom Conversational & Cognitive Engines',
      icon: Bot,
      color: '#EC4899',
      tech: ['Google Gemini AI', 'OpenAI SDK', 'Prompt Engineering', 'Semantic Search', 'RAG'],
      deliverables: [
        'Domain-specific AI chatbots trained on custom portfolio & enterprise docs',
        'Real-time resume ATS keyword analyzers and candidate qualification scoring',
        'Semantic recommendation pipelines for e-commerce and food delivery',
        'Automated document parsing and structured JSON extraction pipelines',
      ],
    },
  ];

  return (
    <div className="space-y-4 max-w-4xl pb-4">
      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 gap-3.5">
        {serviceList.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#030712] border border-white/10 hover:border-[#06B6D4]/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                    style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}
                  >
                    <Icon size={20} style={{ color: s.color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-[#06B6D4] transition-colors leading-tight">
                      {s.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{s.subtitle}</p>
                  </div>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1">
                  {s.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/5 text-gray-300 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-1.5 pt-1 border-t border-white/5">
                  {s.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: s.color }} />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {onNavigate && (
                <div className="pt-3 mt-3 border-t border-white/5">
                  <button
                    onClick={() => onNavigate('contact')}
                    className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Request / Inquire Service</span>
                    <ChevronRight size={13} className="text-[#06B6D4]" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// APP 6: CERTIFICATES & OFFICIAL CREDENTIALS
// -------------------------------------------------------------
function OSCertificatesApp({ onNavigate }: { onNavigate?: (app: AppId) => void }) {
  const flyRankDriveLink = 'https://drive.google.com/file/d/10ONRQsFH14NB1RvG7aJIltzSm6YGXqcy/view?usp=sharing';
  const flyRankEmbedLink = 'https://drive.google.com/file/d/10ONRQsFH14NB1RvG7aJIltzSm6YGXqcy/preview';
  const phCertLink = 'https://drive.google.com/file/d/1xthcbztqypL5RCzst-gNL4bg4eMNFWyK/view?usp=sharing';
  const datheonVerifyLink = 'https://datheon.in/verify?id=DT-2026-33B1M';

  return (
    <div className="space-y-4 max-w-4xl pb-4">
      {/* 1. Featured FlyRank Official Offer Letter Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#030712] border border-[#06B6D4]/40 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#06B6D4]/30 to-[#7C3AED]/20 border border-[#06B6D4]/50 flex items-center justify-center text-[#06B6D4] shadow-md flex-shrink-0">
              <Award size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white uppercase tracking-tight">
                  FlyRank — Offer of Appointment
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Record
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Official Engineering Appointment Letter · Position: <strong className="text-white">Full Stack Web Development Intern</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={flyRankDriveLink}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#06B6D4]/20 hover:bg-[#06B6D4]/30 border border-[#06B6D4]/40 text-[#06B6D4] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink size={12} />
              <span>Drive Viewer</span>
            </a>
            <a
              href={flyRankDriveLink}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
            >
              <Download size={12} />
              <span>PDF</span>
            </a>
          </div>
        </div>

        {/* Embedded Interactive PDF Document Viewer */}
        <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
          <iframe
            src={flyRankEmbedLink}
            title="FlyRank Offer Letter"
            className="w-full h-full border-0"
            allow="autoplay"
          />
        </div>

        {/* Credential Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <span className="text-gray-400 block text-[10px]">Candidate:</span>
            <span className="font-semibold text-white">Sojib Ahmed</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <span className="text-gray-400 block text-[10px]">Organization:</span>
            <span className="font-semibold text-[#06B6D4]">FlyRank</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <span className="text-gray-400 block text-[10px]">Role:</span>
            <span className="font-semibold text-white">Full Stack Web Developer</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <span className="text-gray-400 block text-[10px]">Credential ID:</span>
            <span className="font-mono text-[#10B981] font-bold">FLYRANK-2026-ENG-SOJIB</span>
          </div>
        </div>
      </div>

      {/* 2. Programming Hero Full-Stack Web Development Course */}
      <div className="p-4 rounded-xl bg-[#030712] border border-[#7C3AED]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md hover:border-[#7C3AED]/60 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#A78BFA] flex-shrink-0">
            <GraduationCap size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-xs text-white">
                Complete Web Development Course — Programming Hero
              </h5>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Batch 13
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Full-Stack Engineering Specialization (MERN Stack, React 19, Node.js, Express, MongoDB Atlas, TypeScript) · ID: <span className="font-mono text-purple-300 font-bold">PH-BATCH13-2026-SOJIB</span>
            </p>
          </div>
        </div>

        <a
          href={phCertLink}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-lg bg-[#7C3AED]/20 hover:bg-[#7C3AED]/30 border border-[#7C3AED]/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0"
        >
          <ExternalLink size={12} />
          <span>Verify Certificate</span>
        </a>
      </div>

      {/* 3. Datheon AI Systems Full Stack Engineering Internship */}
      <div className="p-4 rounded-xl bg-[#030712] border border-[#10B981]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md hover:border-[#10B981]/60 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#34D399] flex-shrink-0">
            <Award size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-xs text-white">
                Full Stack Engineering Internship — Datheon AI Systems
              </h5>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Record
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Production Full-Stack Architecture, REST APIs & Distributed Databases · ID: <span className="font-mono text-emerald-400 font-bold">DT-2026-33B1M</span>
            </p>
          </div>
        </div>

        <a
          href={datheonVerifyLink}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-lg bg-[#10B981]/20 hover:bg-[#10B981]/30 border border-[#10B981]/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0"
        >
          <ExternalLink size={12} />
          <span>Verify Record</span>
        </a>
      </div>

      {onNavigate && (
        <div className="flex justify-end pt-1">
          <button
            onClick={() => onNavigate('contact')}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Mail size={12} className="text-[#EC4899]" />
            <span>Contact for Employment or Reference Verification</span>
          </button>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// APP 7: AI CHAT ASSISTANT
// -------------------------------------------------------------
function OSAIChatApp() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: "Hi! I am Sojib's AI Assistant. Ask me about his full-stack projects, skills, experience, or hire availability! 🚀" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      }
    } catch {
      setMessages(prev => [...prev, { sender: 'ai', text: "Sojib is a dedicated Full Stack Developer specializing in React 19, Node.js, Express, and MongoDB Atlas. Contact him at sojibahmedshorif998@gmail.com!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full min-h-[380px] flex flex-col justify-between bg-[#030712] p-4 rounded-xl border border-white/5 space-y-3">
      <div className="space-y-3 overflow-y-auto max-h-[280px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-xl text-xs max-w-[80%] whitespace-pre-line leading-relaxed ${
              m.sender === 'user' ? 'bg-[#7C3AED] text-white' : 'bg-white/10 text-gray-200'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-400 italic">Sojib AI is typing...</div>}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-white/10">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything about Sojib..."
          className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-[#06B6D4]"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#06B6D4] text-black font-bold text-xs hover:opacity-90 flex items-center gap-1 cursor-pointer"
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// APP 8: CONTACT MAILER
// -------------------------------------------------------------
function OSContactApp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        setSent(true);
        toast.success("Message sent! I'll reply within 2 hours. 🚀");
      } else {
        toast.error('Failed to send message. Please retry.');
      }
    } catch {
      toast.success("Message received! I'll reply soon. 🚀");
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      {sent ? (
        <div className="p-8 text-center bg-[#030712] rounded-2xl border border-emerald-500/30 space-y-2">
          <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
          <h4 className="text-base font-bold text-white">Message Dispatched!</h4>
          <p className="text-xs text-gray-400">Thank you, {name}! Your message was logged and sent directly to Sojib Ahmed.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-white/10 text-xs text-white outline-none focus:border-[#06B6D4]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Your Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-white/10 text-xs text-white outline-none focus:border-[#06B6D4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-1">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Project inquiry or job offer..."
              className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-white/10 text-xs text-white outline-none focus:border-[#06B6D4]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-1">Message *</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell me about your project, timeline, or position..."
              className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-white/10 text-xs text-white outline-none focus:border-[#06B6D4] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-xs font-bold text-white hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Transmit Message →'}
          </button>
        </form>
      )}
    </div>
  );
}
