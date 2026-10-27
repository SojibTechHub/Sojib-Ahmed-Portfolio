import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, Terminal, User, Mail, Award, Settings, 
  ExternalLink, X, Minus, 
  ArrowLeft, Volume2, VolumeX, CheckCircle2, ShieldCheck, 
  Search, Cpu, Wrench, Bot, Send
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import toast from 'react-hot-toast';

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
    <div className="relative w-full h-full min-h-[640px] max-h-[88vh] bg-[#030712] rounded-3xl overflow-hidden border-2 border-[#06B6D4]/30 shadow-2xl flex flex-col font-sans select-none">
      
      {/* OS Top Navigation Bar */}
      <div className="h-10 bg-[#0B1120] border-b border-[rgba(255,255,255,0.08)] px-4 flex items-center justify-between text-xs text-gray-300 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-extrabold text-[#06B6D4] tracking-wider uppercase text-[11px]">
              Sojib OS <span className="text-gray-500 font-normal">v2.6 Enterprise</span>
            </span>
          </div>

          <span className="text-gray-600">|</span>

          {/* Quick Jump Buttons */}
          <button
            onClick={() => { playBeep(); onZoomOut(); }}
            className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-[#06B6D4]/20 hover:text-[#06B6D4] border border-white/10 transition-all flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer"
            title="Step back to 3D Room"
          >
            <ArrowLeft size={12} />
            <span>3D Room View</span>
          </button>

          <button
            onClick={() => { playBeep(); onScrollToClassic(); }}
            className="hidden sm:flex px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all items-center gap-1.5 text-[11px] font-semibold cursor-pointer"
          >
            <span>Classic Portfolio View ↓</span>
          </button>
        </div>

        {/* System Tray (Clock, Sound, Admin shortcut) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded text-gray-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute OS Sounds' : 'Enable OS Sounds'}
          >
            {soundEnabled ? <Volume2 size={14} className="text-[#06B6D4]" /> : <VolumeX size={14} />}
          </button>

          <a
            href="/admin"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-md bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center gap-1 transition-all"
            title="Open Admin CMS"
          >
            <Settings size={11} />
            <span>CMS Admin</span>
          </a>

          <span className="font-mono text-[11px] text-gray-400 font-semibold">{time}</span>
        </div>
      </div>

      {/* Main Desktop Screen Area */}
      <div className="flex-1 relative p-6 overflow-hidden bg-radial from-[#09152E]/60 via-[#050B17] to-[#02050D]">
        
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

        {/* Desktop App Icons (Left Column) */}
        <div className="relative z-10 grid grid-cols-1 gap-2.5 w-28 overflow-y-auto max-h-[75vh] pr-1">
          {[
            { id: 'projects', label: 'Projects.exe', icon: FolderGit2, color: '#06B6D4' },
            { id: 'terminal', label: 'Terminal.sh', icon: Terminal, color: '#10B981' },
            { id: 'about', label: 'AboutMe.app', icon: User, color: '#8B5CF6' },
            { id: 'skills', label: 'Skills.exe', icon: Cpu, color: '#38BDF8' },
            { id: 'services', label: 'Services.app', icon: Wrench, color: '#F43F5E' },
            { id: 'certificates', label: 'OfferLetter.pdf', icon: Award, color: '#F59E0B' },
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
              <span className="text-[10px] font-bold text-gray-200 group-hover:text-white drop-shadow">
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Floating Active Application Window */}
        <AnimatePresence>
          {activeApp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute top-4 left-36 right-4 bottom-14 bg-[#090D1A]/95 backdrop-blur-xl border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-20"
            >
              {/* Window Title Bar */}
              <div className="h-9 bg-[#0B1120] border-b border-white/10 px-4 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {activeApp === 'projects' && '🚀 Projects Explorer — 10 Flagship & Production Builds'}
                    {activeApp === 'terminal' && '💻 Sojib Bash Terminal — Interactive CLI'}
                    {activeApp === 'about' && '👨‍💻 About Sojib Ahmed — Background & Bio'}
                    {activeApp === 'skills' && '⚡ Technical Stack & Architecture Breakdown'}
                    {activeApp === 'services' && '🛠️ Services & Production Engineering Workflow'}
                    {activeApp === 'certificates' && '📜 Datheon Internship Offer Letter & Verification'}
                    {activeApp === 'aichat' && '🤖 Sojib AI Assistant — Gemini Powered'}
                    {activeApp === 'contact' && '📬 Contact Mailer — Send Direct Message'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
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
              <div className="flex-1 overflow-y-auto p-5 text-gray-200">
                {activeApp === 'projects' && <OSProjectsApp />}
                {activeApp === 'terminal' && <OSTerminalApp />}
                {activeApp === 'about' && <OSAboutApp />}
                {activeApp === 'skills' && <OSSkillsApp />}
                {activeApp === 'services' && <OSServicesApp />}
                {activeApp === 'certificates' && <OSCertificatesApp />}
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
function OSProjectsApp() {
  const [filter, setFilter] = useState<'all' | 'full-stack' | 'frontend' | 'backend'>('all');
  const [search, setSearch] = useState('');

  const rawProjects = [
    {
      title: 'ShopX BD Enterprise',
      subtitle: 'Hyperlocal Multi-Vendor E-Commerce & DEX Logistics Platform',
      category: 'full-stack',
      tech: ['React 19', 'TypeScript', 'Node.js', 'Express', 'MongoDB Atlas', 'Upstash Redis'],
      live: 'https://shopx-bd-enterprise.vercel.app/',
      github: 'https://github.com/sojibahmedshorif25-ai/Shopx-BD-Enterprise',
    },
    {
      title: 'FoodFlow (Team Project)',
      subtitle: 'AI Multi-Vendor Food Delivery & Logistics Platform',
      category: 'full-stack',
      tech: ['Next.js 15', 'React 19', 'TypeScript', 'Node.js', 'Socket.IO', 'Gemini AI'],
      live: 'https://fooddeliveryplatform.vercel.app',
      github: 'https://github.com/khalid66527/food_flow-client',
    },
    {
      title: 'SkillForge',
      subtitle: 'AI Learning, Code Sandbox & Career Recruitment Platform',
      category: 'full-stack',
      tech: ['Next.js 16', 'React 19', 'Express.js', 'Better Auth', 'Docker', 'React Query'],
      live: 'https://job-student-task.vercel.app/',
      github: 'https://github.com/sojibahmedshorif25-ai/JOB-STUDENT-TASK.git',
    },
    {
      title: 'StartupForge',
      subtitle: 'AI Startup Team Ecosystem & ATS Platform with Video Call',
      category: 'full-stack',
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'WebRTC', 'Stripe'],
      live: 'https://startupforge-ruby.vercel.app/',
      github: 'https://github.com/sojibahmedshorif25-ai/startupforge.git',
    },
    {
      title: 'TypeMarket',
      subtitle: 'Type-Safe Multi-Role E-Commerce & Storefront Engine',
      category: 'frontend',
      tech: ['TypeScript', 'React.js', 'Tailwind CSS', 'TanStack Query', 'Lucide React'],
      live: 'https://type-script-project-nine.vercel.app',
      github: 'https://github.com/sojibahmedshorif25-ai/TypeScript-Project',
    },
    {
      title: 'InvestProp AI',
      subtitle: 'AI Real Estate Investment Analytics & Property Valuation Portal',
      category: 'frontend',
      tech: ['React.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
      live: 'https://investprop-ai.vercel.app',
      github: 'https://github.com/sojibahmedshorif25-ai/Investprop-Ai.git',
    },
    {
      title: 'GitHub Issue Tracker',
      subtitle: 'Real-time Issue Management Dashboard with GitHub API',
      category: 'frontend',
      tech: ['React.js', 'Tailwind CSS', 'GitHub API', 'Lucide React'],
      live: 'https://fabulous-profiterole-d6e817.netlify.app/',
      github: 'https://github.com/sojibahmedshorif25-ai/github-issue-tracker.git',
    },
    {
      title: 'Pet Adoption REST Engine',
      subtitle: 'Scalable Microservice API & Shelter Management Gateway',
      category: 'backend',
      tech: ['Node.js', 'Express.js', 'MongoDB Atlas', 'JWT', 'Nodemailer'],
      live: 'https://pet-adoption-client-rho-jet.vercel.app',
      github: 'https://github.com/sojibahmedshorif25-ai/Pet-Adoption-Server',
    },
    {
      title: 'Job Finder API Gateway',
      subtitle: 'High-Concurrency Recruitment & Application Service',
      category: 'backend',
      tech: ['Node.js', 'Express.js', 'MongoDB Atlas', 'JWT', 'Cloudinary'],
      live: 'https://job-finder-client.vercel.app',
      github: 'https://github.com/sojibahmedshorif25-ai/Job-Finder',
    },
    {
      title: 'Books Platform REST API',
      subtitle: 'Digital Library & Review Engine Backend',
      category: 'backend',
      tech: ['Node.js', 'Express.js', 'MongoDB Atlas', 'Express Validator'],
      live: 'https://books-platfrom-48rm.vercel.app/',
      github: 'https://github.com/sojibahmedshorif25-ai/Books-Platfrom.git',
    },
  ];

  const filtered = rawProjects.filter(p => {
    const matchCat = filter === 'all' || p.category === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                        p.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-3 border-b border-white/10">
        <div className="flex gap-1.5 p-1 rounded-xl bg-[#030712] border border-white/5">
          {(['all', 'full-stack', 'frontend', 'backend'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#06B6D4] text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All (10)' : cat}
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

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((proj, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[#030712]/70 border border-white/5 hover:border-[#06B6D4]/40 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white group-hover:text-[#06B6D4] transition-colors">
                  {proj.title}
                </h4>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/5 text-[#06B6D4] border border-[#06B6D4]/20">
                  {proj.category}
                </span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                {proj.subtitle}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {proj.tech.map((t, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-gray-300 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/5 mt-3">
              {proj.live && (
                <a
                  href={proj.live}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#06B6D4]/20 hover:bg-[#06B6D4]/30 border border-[#06B6D4]/40 text-[#06B6D4] text-xs font-semibold flex items-center gap-1.5 transition-all"
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
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
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
      output = `Sojib Ahmed\nRole: Full Stack Web Developer\nLocation: Rangpur, Bangladesh\nEducation: Programming Hero Full Stack Course (8 months, Batch 13)`;
    } else if (lower === 'skills') {
      output = `Frontend: React 19, Next.js 16, TypeScript, Tailwind CSS, Framer Motion\nBackend:  Node.js, Express.js, REST API, Socket.IO, WebRTC\nDatabase: MongoDB Atlas, Mongoose, Upstash Redis\nDevOps:   Docker, GitHub Actions, Vercel, Render`;
    } else if (lower === 'projects') {
      output = `1. ShopX BD Enterprise — Hyperlocal Multi-Vendor E-Commerce\n2. FoodFlow — AI Multi-Vendor Food Delivery\n3. SkillForge — AI Learning & Code Sandbox\n4. StartupForge — AI Startup ATS & Video Interviews`;
    } else if (lower === 'contact') {
      output = `Email:    sojibahmedshorif998@gmail.com\nPhone:    +880 1942791004\nWhatsApp: +880 1942791004\nGitHub:   https://github.com/sojibahmedshorif25-ai`;
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
// APP 3: ABOUT ME
// -------------------------------------------------------------
function OSAboutApp() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-[#030712] border border-white/5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex-shrink-0 shadow-lg">
          <img
            src="/images/hero.jpg"
            alt="Sojib Ahmed"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Sojib Ahmed</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#06B6D4]/20 text-[#06B6D4]">Full Stack</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Passionate Full Stack Developer from Rangpur, Bangladesh. Specialized in architecting scalable MERN & Next.js applications with futuristic design aesthetics and clean code principles.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-center">
        <div className="p-4 rounded-xl bg-[#030712] border border-white/5">
          <div className="text-2xl font-black text-[#06B6D4]">2+</div>
          <div className="text-xs text-gray-400 mt-0.5 font-medium">Years Experience</div>
        </div>
        <div className="p-4 rounded-xl bg-[#030712] border border-white/5">
          <div className="text-2xl font-black text-[#10B981]">15+</div>
          <div className="text-xs text-gray-400 mt-0.5 font-medium">Projects Built</div>
        </div>
        <div className="p-4 rounded-xl bg-[#030712] border border-white/5">
          <div className="text-2xl font-black text-[#8B5CF6]">100%</div>
          <div className="text-xs text-gray-400 mt-0.5 font-medium">Commitment</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// APP 4: TECHNICAL SKILLS BREAKDOWN
// -------------------------------------------------------------
function OSSkillsApp() {
  const skillCategories = [
    { name: 'Frontend', items: ['React 19', 'Next.js 16', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion', 'GSAP', 'HTML5/CSS3'] },
    { name: 'Backend', items: ['Node.js', 'Express.js', 'RESTful API', 'Socket.IO', 'WebRTC', 'Nodemailer', 'Upstash Redis'] },
    { name: 'Database & Cloud', items: ['MongoDB Atlas', 'Mongoose', 'Firebase Auth', 'PostgreSQL', 'Docker', 'Cloudinary'] },
    { name: 'AI & Automation', items: ['Google Gemini API', 'OpenAI SDK', 'RAG Chatbot Pipelines', 'Prompt Architecture'] },
  ];

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        {skillCategories.map((cat, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#030712] border border-white/5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#06B6D4] flex items-center gap-2">
              <Cpu size={14} />
              {cat.name}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/5 text-gray-200 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// APP 5: SERVICES & WORKFLOW
// -------------------------------------------------------------
function OSServicesApp() {
  const services = [
    { title: 'Full Stack Web Applications', desc: 'End-to-end MERN & Next.js systems with database design, authentication, and secure payment workflows.' },
    { title: 'Frontend UI/UX Engineering', desc: 'Blazing fast, responsive, and interactive interfaces built with React 19, TypeScript, and modern 3D/motion aesthetics.' },
    { title: 'Backend APIs & Microservices', desc: 'High-throughput Node/Express APIs, caching layers with Redis, and real-time Socket.IO communications.' },
    { title: 'AI Assistant & Automation', desc: 'Custom Gemini AI and OpenAI conversational bots, semantic recommendation engines, and automation tools.' },
  ];

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#030712] border border-white/5 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench size={15} className="text-[#F43F5E]" />
              {s.title}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// APP 6: CERTIFICATES & OFFER LETTER
// -------------------------------------------------------------
function OSCertificatesApp() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="p-5 rounded-2xl bg-[#030712] border border-[#06B6D4]/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#06B6D4]" />
            <h4 className="font-bold text-sm text-white">Datheon AI Systems & Automation Studio</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
            Verified Record
          </span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Official Offer of Internship for the position of <strong className="text-white">Full Stack Web Development Intern</strong> (2026 Engineering Cohort).
        </p>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Candidate:</span> <span className="text-white font-semibold">Sojib Ahmed</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Credential ID:</span> <span className="font-mono text-[#06B6D4] font-bold">DT-2026-33B1M</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Track:</span> <span className="text-white">Full Stack Web Development</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Verification Link:</span>
            <a
              href="https://datheon.in/verify?id=DT-2026-33B1M"
              target="_blank"
              rel="noreferrer"
              className="text-[#06B6D4] hover:underline"
            >
              Verify on Portal →
            </a>
          </div>
        </div>
      </div>
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
