import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden="true" />
      
      <div className="absolute top-1/2 left-1/2 w-96 h-96 orb orb-violet opacity-15 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="section-badge mx-auto w-fit mb-6">
            <div className="status-dot" />
            Let's Collaborate
          </div>

          {/* Heading */}
          <h2 className="text-[clamp(32px,5vw,60px)] font-black leading-tight tracking-tight text-[var(--color-text-primary)] mb-6">
            Ready to Build Something <span className="gradient-text">High-Impact?</span>
          </h2>

          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you're hiring a dedicated Full-Stack Engineer for your engineering team or need an architect to scale your web systems — let's connect and create something remarkable.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-base px-8 py-4"
              id="finalcta-start-project"
            >
              Start a Project
              <ArrowRight size={18} />
            </motion.button>

            <motion.a
              href="mailto:sojibahmedshorif998@gmail.com"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-secondary text-base px-8 py-4"
              id="finalcta-lets-talk"
            >
              Let's Talk
            </motion.a>
          </div>

          {/* Subtle divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 h-px max-w-xs mx-auto"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-4 text-sm text-[var(--color-text-secondary)]"
          >
            You scrolled all the way down! Here's a cookie 🍪 — open to new opportunities!
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
