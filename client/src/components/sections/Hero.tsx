import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ChevronDown, MapPin } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa6';

const terminalLines = [
  { prompt: '$', command: 'whoami', output: 'Sojib Ahmed', delay: 500 },
  { prompt: '$', command: 'role', output: 'Full Stack Developer', delay: 1200 },
  { prompt: '$', command: 'location', output: 'Rangpur, Bangladesh ðŸŒ', delay: 2000 },
  { prompt: '$', command: 'status', output: 'Building something awesome... ðŸš€', delay: 2800 },
  { prompt: '$', command: 'available', output: 'true // Full-time | Freelance | Remote âœ…', delay: 3600 },
];

function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [typingLine, setTypingLine] = useState<number | null>(null);
  const [typedChars, setTypedChars] = useState<Record<number, number>>({});

  useEffect(() => {
    terminalLines.forEach((line, i) => {
      setTimeout(() => {
        setTypingLine(i);
        // Type command char by char
        const chars = line.command.length;
        for (let c = 0; c <= chars; c++) {
          setTimeout(() => {
            setTypedChars(prev => ({ ...prev, [i]: c }));
            if (c === chars) {
              setTimeout(() => {
                setVisibleLines(prev => [...prev, i]);
                setTypingLine(null);
              }, 200);
            }
          }, c * 60);
        }
      }, line.delay);
    });
  }, []);

  return (
    <div className="terminal w-full">
      <div className="terminal-header">
        <div className="terminal-dot bg-[#FF5F56]" />
        <div className="terminal-dot bg-[#FFBD2E]" />
        <div className="terminal-dot bg-[#27C93F]" />
        <span className="ml-2 text-xs text-[var(--color-text-secondary)]">sojib@portfolio ~ bash</span>
      </div>
      <div className="terminal-body space-y-1.5 min-h-[190px]">
        {terminalLines.map((line, i) => {
          const isTyping = typingLine === i;
          const isDone = visibleLines.includes(i);
          const charCount = typedChars[i] || 0;

          if (!isTyping && !isDone) return null;

          return (
            <div key={i} className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="terminal-prompt">{line.prompt}</span>
                <span className="terminal-text">
                  {isTyping ? line.command.slice(0, charCount) : line.command}
                  {isTyping && <span className="terminal-cursor" />}
                </span>
              </div>
              {isDone && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="terminal-dim pl-4"
                >
                  {line.output}
                </motion.div>
              )}
            </div>
          );
        })}
        {typingLine === null && visibleLines.length === terminalLines.length && (
          <div className="flex items-center gap-2 mt-1">
            <span className="terminal-prompt">$</span>
            <span className="terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  // Three.js-style particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const colors = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(16,185,129,'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mouse influence
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach(p => {
        // Mouse attraction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx += (dx / dist) * 0.02;
          p.vy += (dy / dist) * 0.02;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${(1 - d / 100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    draw();
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-10">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-50" aria-hidden="true" />

      {/* Gradient orbs */}
      <div className="orb orb-violet absolute top-20 left-[-100px] w-[500px] h-[500px] opacity-20" aria-hidden="true" />
      <div className="orb orb-cyan absolute bottom-20 right-[-100px] w-[400px] h-[400px] opacity-15" aria-hidden="true" />

      <div className="container-custom relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-14 items-center">
          {/* Left Content - 60% */}
          <div className="lg:col-span-3">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-6 sm:mb-8"
            >
              <div className="flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full glass border border-[rgba(16,185,129,0.3)] shadow-sm shadow-[rgba(16,185,129,0.1)]">
                <div className="status-dot" />
                <span className="text-[11px] sm:text-xs font-semibold text-[#10B981] tracking-wider uppercase">
                  Open to Full-Time, Internship & Freelance
                </span>
              </div>
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mb-2 font-medium">
                Hey, I'm ðŸ‘‹
              </p>
              <h1 className="text-[clamp(36px,6.5vw,84px)] font-black leading-none tracking-tight text-[var(--color-text-primary)] mb-4 sm:mb-6">
                Sojib Ahmed
              </h1>
            </motion.div>

            {/* Role with gradient */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-[clamp(18px,3vw,32px)] font-bold leading-snug text-[var(--color-text-primary)]">
                Building Scalable,{' '}
                <span className="gradient-text">Real-World Web Applications.</span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mb-6 sm:mb-8"
            >
              Full Stack Developer specializing in React, Next.js, TypeScript, Node.js, and modern web technologies. I build fast, secure, scalable, and user-focused web applications.</motion.p>

            {/* Social proof stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              {[
                { value: 'Full Stack', label: 'MERN & Next.js' },
                { value: 'Production', label: 'Cloud Architecture' },
                { value: '35+', label: 'Technologies' },
                { value: '100%', label: 'Commitment' },
              ].map(({ value, label }) => (
                <div key={label} className="text-left pr-3 border-r last:border-r-0 border-[rgba(255,255,255,0.08)]">
                  <div className="text-xl sm:text-2xl font-black gradient-text leading-none">{value}</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">{label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-2.5 sm:gap-3 mb-6 sm:mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
                id="hero-view-work"
              >
                View My Work
                <ArrowRight size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
                id="hero-lets-work"
              >
                Let's Work Together
              </motion.button>

              <motion.a
                href="https://drive.google.com/file/d/1I_yOQ82k2LqFINo5RuR_tXVEzzwAZkGx/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-ghost"
                id="hero-download-resume"
              >
                <Download size={15} />
                View Resume
              </motion.a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-3 sm:gap-4"
            >
              <span className="text-xs text-[var(--color-text-secondary)]">Find me on:</span>
              {[
                { icon: FaGithub, href: 'https://github.com/SojibTechHub', label: 'GitHub', id: 'social-GitHub' },
                { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/sojib-ahmed-shorif', label: 'LinkedIn', id: 'social-LinkedIn' },
                { icon: FaEnvelope, href: 'mailto:sojibahmedshorif998@gmail.com', label: 'Email', id: 'social-email' },
              ].map(({ icon: Icon, href, label, id }) => (
                <motion.a
                  key={id}
                  id={id}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="social-icon flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white"
                  aria-label={label}
                >
                  <Icon size={17} />
                </motion.a>
              ))}
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] ml-1">
                <MapPin size={12} className="text-[#06B6D4]" />
                Rangpur, Bangladesh
              </div>
            </motion.div>
          </div>

          {/* Right Panel - 40% */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
              className="relative"
            >
              {/* Developer Command Center */}
              <div className="relative space-y-4">
                {/* Tech Badges Row */}
                <div className="glass rounded-xl p-3 border border-[rgba(124,58,237,0.2)] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                    <span className="text-xs font-mono font-semibold text-[var(--color-text-primary)]">FULL STACK STACK</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'Node.js', 'MongoDB', 'TypeScript', 'Next.js'].map(tech => (
                      <span key={tech} className="tech-badge text-[10px] px-2 py-0.5">{tech}</span>
                    ))}
                  </div>
                </div>

                {/* Terminal */}
                <TerminalWindow />

                </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <span className="text-[11px] text-[var(--color-text-secondary)] tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} className="text-[#06B6D4]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
