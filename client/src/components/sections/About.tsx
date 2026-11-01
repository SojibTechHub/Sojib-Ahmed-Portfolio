import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Code2, Brain, Heart, Rocket, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const traits = [
  { icon: Code2, color: '#7C3AED', title: 'Who I Am', desc: 'A dedicated Full Stack Developer from Rangpur, Bangladesh with a passion for building products that matter.' },
  { icon: Brain, color: '#06B6D4', title: 'How I Think', desc: 'I approach problems systematically — breaking complex challenges into clean, maintainable solutions.' },
  { icon: Heart, color: '#EC4899', title: 'Why I Care', desc: 'I believe great software is about the people using it. UX is never an afterthought in my work.' },
  { icon: Rocket, color: '#10B981', title: 'What Drives Me', desc: "Commitment to real-world impact. I don't build for demos — I build for users and production." },
];

export default function About() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="about" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 orb orb-violet opacity-10" aria-hidden="true" />

      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.div variants={fadeUp} className="section-badge mx-auto w-fit">
            <span>👤</span> About Me
          </motion.div>
          <motion.h2 variants={fadeUp} className="section-heading mt-2">
            About My Development Journey.
          </motion.h2>
          <motion.p variants={fadeUp} className="section-subheading mx-auto text-center">
            A project-driven Full-Stack Developer focused on building scalable, real-world web applications.
          </motion.p>
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          {/* Left: Profile */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Avatar */}
            <div className="relative mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative w-full max-w-sm mx-auto lg:mx-0"
              >
                {/* Glow border */}
                <div className="absolute -inset-1 rounded-3xl opacity-70 blur-md"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4, #10B981)' }} />
                
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] p-1 bg-gradient-to-b from-[rgba(124,58,237,0.3)] to-[rgba(6,182,212,0.2)] shadow-2xl">
                  {/* Profile Image with crisp rendering */}
                  <div className="w-full h-full relative rounded-2xl overflow-hidden bg-[#050508]">
                    <img
                      src="/images/hero.jpg"
                      alt="Sojib Ahmed - Full Stack Developer"
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    />
                    {/* Subtle bottom gradient vignette */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050508]/80 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Status badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-6 py-2.5 rounded-full glass border border-[rgba(16,185,129,0.4)] shadow-xl whitespace-nowrap">
                  <div className="status-dot" />
                  <span className="text-sm font-semibold text-[#10B981]">Available for Hire</span>
                </div>
              </motion.div>
            </div>

            {/* Quick info */}
            <div className="mt-8 space-y-3">
              {[
                { icon: MapPin, label: 'Location', value: 'Rangpur, Bangladesh' },
                { icon: Code2, label: 'Core Specialization', value: 'Full Stack Development' },
                { icon: Rocket, label: 'Architecture', value: 'Production MERN & Next.js Systems' },
                { icon: CheckCircle2, label: 'Current Status', value: 'Available for Hire' },
              ].map(({ icon: Icon, label, value }, idx) => (
                <div key={`${label}-${idx}`} className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(124,58,237,0.1)' }}>
                    <Icon size={18} className="text-[#8B5CF6]" />
                  </div>
                  <div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{label}</div>
                    <div className="text-base font-semibold text-[var(--color-text-primary)]">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="lg:col-span-3 space-y-12"
          >
            {/* Intro paragraph */}
            <motion.div variants={fadeUp} className="space-y-4">
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
                I'm <span className="text-[var(--color-text-primary)] font-semibold">Sojib Ahmed</span>, a Full-Stack Developer specialized in enterprise MERN & Next.js architectures, real-time WebSockets, and scalable cloud systems. I build high-performance production systems with hands-on experience in React, Next.js, Node.js, TypeScript, REST APIs, authentication, databases, real-time applications, AI integrations, and deployment.
              </p>
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
                I enjoy turning ideas into practical, scalable, and user-focused applications while continuously improving my problem-solving and software engineering skills.
              </p>
            </motion.div>

            {/* Traits grid */}
            <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-8">
              {traits.map(({ icon: Icon, color, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="card p-8"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{title}</h3>
                  <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* What makes me different */}
            <motion.div variants={fadeUp} className="highlight-box">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">What Makes Me Different</h3>
              <ul className="space-y-2">
                {[
                  "I build for real users, not just to complete tasks",
                  "Clean, documented, maintainable code is non-negotiable",
                  "I stay current with the latest web technologies & best practices",
                  "I communicate proactively and meet deadlines consistently",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                    <CheckCircle2 size={14} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
