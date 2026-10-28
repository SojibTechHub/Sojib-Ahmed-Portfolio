import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { allSkillsList, type Skill, type SkillCategory } from '../../data/skills';
import { 
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss, 
  SiReactquery, SiFramer, SiGreensock, SiRedux, SiHtml5, SiVite, 
  SiNodedotjs, SiExpress, SiSocketdotio, SiWebrtc, SiRedis, 
  SiCloudinary, SiMongodb, SiPostgresql, SiJsonwebtokens, 
  SiFirebase, SiDocker, SiGithub, SiGithubactions, 
  SiVercel, SiRender, SiPostman, SiLinux, SiGooglegemini, 
  SiStripe, SiLeaflet 
} from 'react-icons/si';
import { 
  FaGoogle, FaEnvelope, FaCreditCard, 
  FaShieldHalved, FaChartLine 
} from 'react-icons/fa6';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getSkillRealIcon(name: string, size = 26) {
  switch (name) {
    case 'React 19 / React.js':
      return <SiReact size={size} color="#61DAFB" />;
    case 'Next.js 15 & 16':
      return <SiNextdotjs size={size} color="#FFFFFF" />;
    case 'TypeScript':
      return <SiTypescript size={size} color="#3178C6" />;
    case 'JavaScript (ES6+)':
      return <SiJavascript size={size} color="#F7DF1E" />;
    case 'Tailwind CSS v4':
      return <SiTailwindcss size={size} color="#06B6D4" />;
    case 'TanStack Query (React Query)':
      return <SiReactquery size={size} color="#FF4154" />;
    case 'Framer Motion':
      return <SiFramer size={size} color="#FF0055" />;
    case 'GSAP Animation':
      return <SiGreensock size={size} color="#88CE02" />;
    case 'Redux Toolkit & Zustand':
      return <SiRedux size={size} color="#764ABC" />;
    case 'HTML5 & Semantic Web':
      return <SiHtml5 size={size} color="#E34F26" />;
    case 'Vite & Modern Bundlers':
      return <SiVite size={size} color="#646CFF" />;
    case 'Node.js':
      return <SiNodedotjs size={size} color="#339933" />;
    case 'Express.js':
      return <SiExpress size={size} color="#FFFFFF" />;
    case 'Socket.IO Real-Time':
      return <SiSocketdotio size={size} color="#FFFFFF" />;
    case 'WebRTC Video & Audio':
      return <SiWebrtc size={size} color="#339933" />;
    case 'Upstash Redis Caching':
      return <SiRedis size={size} color="#FF4438" />;
    case 'Nodemailer & SMTP':
      return <FaEnvelope size={size} color="#EA4335" />;
    case 'Multer & Cloudinary SDK':
      return <SiCloudinary size={size} color="#3448C5" />;
    case 'RESTful Architecture':
      return <FaChartLine size={size} color="#06B6D4" />;
    case 'MongoDB Atlas & Mongoose':
      return <SiMongodb size={size} color="#47A248" />;
    case 'PostgreSQL & Supabase':
      return <SiPostgresql size={size} color="#4169E1" />;
    case 'JWT Authentication':
      return <SiJsonwebtokens size={size} color="#D63AFF" />;
    case 'Better Auth & OAuth 2.0':
      return <FaGoogle size={size} color="#4285F4" />;
    case 'RBAC Access Control':
      return <FaShieldHalved size={size} color="#7C3AED" />;
    case 'Firebase Authentication':
      return <SiFirebase size={size} color="#FFCA28" />;
    case 'Docker & Docker Compose':
      return <SiDocker size={size} color="#2496ED" />;
    case 'Git & GitHub Workflows':
      return <SiGithub size={size} color="#F05032" />;
    case 'GitHub Actions (CI/CD)':
      return <SiGithubactions size={size} color="#2088FF" />;
    case 'Vercel Deployment':
      return <SiVercel size={size} color="#FFFFFF" />;
    case 'Render Cloud Platform':
      return <SiRender size={size} color="#46E3B7" />;
    case 'Postman API Testing':
      return <SiPostman size={size} color="#FF6C37" />;
    case 'Linux & Bash Scripting':
      return <SiLinux size={size} color="#FCC624" />;
    case 'Google Gemini AI API':
      return <SiGooglegemini size={size} color="#4285F4" />;
    case 'Stripe Payment Gateway':
      return <SiStripe size={size} color="#635BFF" />;
    case 'SSLCommerz Gateway':
      return <FaCreditCard size={size} color="#00A65A" />;
    case 'Leaflet GIS Maps':
      return <SiLeaflet size={size} color="#199900" />;
    default:
      return <SiReact size={size} color="#06B6D4" />;
  }
}

export default function Skills() {
  const [skillList, setSkillList] = useState<Skill[]>(allSkillsList);
  const [activeTab, setActiveTab] = useState('frontend');
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    // 1. Try local storage cache
    try {
      const saved = localStorage.getItem('sojib_custom_skills');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSkillList(parsed);
        }
      }
    } catch {}

    // 2. Fetch from backend API
    const fetchLiveSkills = async () => {
      try {
        const res = await fetch(`${API_BASE}/skills`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSkillList(data.data);
          localStorage.setItem('sojib_custom_skills', JSON.stringify(data.data));
        }
      } catch {}
    };

    fetchLiveSkills();
  }, []);

  const dynamicCategories: SkillCategory[] = [
    {
      id: 'frontend',
      label: 'Frontend',
      skills: skillList.filter(s => s.category === 'frontend'),
    },
    {
      id: 'backend',
      label: 'Backend & APIs',
      skills: skillList.filter(s => s.category === 'backend'),
    },
    {
      id: 'database',
      label: 'Database & Auth',
      skills: skillList.filter(s => s.category === 'database'),
    },
    {
      id: 'devops',
      label: 'DevOps & Cloud',
      skills: skillList.filter(s => s.category === 'devops'),
    },
    {
      id: 'ai-services',
      label: 'AI & Services',
      skills: skillList.filter(s => s.category === 'ai-services'),
    },
  ];

  const activeCategory = dynamicCategories.find(c => c.id === activeTab) || dynamicCategories[0];

  return (
    <section id="skills" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background Ambience */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" aria-hidden="true" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] orb orb-violet opacity-15 pointer-events-none blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-badge mx-auto w-fit mb-3">
            <span>⚡</span> Technical Skills & Stack
          </div>
          <h2 className="section-heading">Production Tech Stack</h2>
          <p className="section-subheading mx-auto text-center max-w-2xl">
            Real-world technologies and tools battle-tested across my production repositories with authentic vector brand icons.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
          role="tablist"
          aria-label="Skill categories"
        >
          {dynamicCategories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab(cat.id)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`skills-panel-${cat.id}`}
                id={`skills-tab-${cat.id}`}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                  isActive
                    ? 'text-white border-primary shadow-[0_0_20px_rgba(124,58,237,0.4)]'
                    : 'text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)] hover:border-primary/40 bg-[var(--color-surface)]/60'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                } : undefined}
              >
                <span>{cat.label}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-[var(--color-text-secondary)]'
                }`}>
                  {cat.skills.length}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Clean Modern Skills Grid with Real Icons */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            id={`skills-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`skills-tab-${activeTab}`}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {activeCategory.skills.map((skill: Skill, i: number) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative p-4 rounded-2xl bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] hover:border-[#06B6D4]/50 transition-all duration-300 shadow-sm hover:shadow-[0_8px_25px_rgba(6,182,212,0.18)] flex items-start gap-3.5"
              >
                {/* Glow on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                  style={{ background: skill.color }}
                />

                {/* Tech Real Vector Brand Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-110 shadow-sm"
                  style={{ 
                    background: `${skill.color}15`, 
                    border: `1px solid ${skill.color}35` 
                  }}
                >
                  {getSkillRealIcon(skill.name, 26)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="font-bold text-sm text-[var(--color-text-primary)] group-hover:text-[#06B6D4] transition-colors truncate">
                      {skill.name}
                    </h3>
                    {skill.experienceLevel && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-gray-400 flex-shrink-0">
                        {skill.experienceLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-snug line-clamp-2">
                    {skill.description}
                  </p>
                  {skill.repoProof && (
                    <div className="text-[10px] text-gray-500 mt-1 truncate font-mono">
                      📁 {skill.repoProof}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
