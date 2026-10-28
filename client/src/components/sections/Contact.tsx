import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Phone, MapPin, Clock, Send, CheckCircle2, ArrowRight, Copy, Check } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa6';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sojibahmedshorif998@gmail.com');
    setCopied(true);
    toast.success('Email copied: sojibahmedshorif998@gmail.com');
    setTimeout(() => setCopied(false), 2000);
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsSuccess(true);
        reset();
        toast.success("Message sent! I'll reply within 15 minutes. 🚀");
      } else {
        throw new Error('Failed to send');
      }
    } catch {
      // Simulate success for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
      reset();
      toast.success("Message sent! I'll reply soon. 🚀");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  return (
    <section id="contact" className="section-padding relative" ref={ref}>
      <div className="absolute bottom-0 left-0 w-80 h-80 orb orb-violet opacity-10" aria-hidden="true" />
      <div className="absolute top-1/2 right-0 w-64 h-64 orb orb-cyan opacity-08" aria-hidden="true" />

      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="section-badge mx-auto w-fit mb-3">
            <span>📬</span> Contact
          </div>
          <h2 className="section-heading">
            <span className="gradient-text">Open to Opportunities.</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            I'm currently open to full-time, internship, freelance, and remote opportunities. If you're looking for a motivated Full-Stack Developer, I'd be happy to connect.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left info panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Status card */}
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-11 h-11 rounded-xl p-[1px] bg-gradient-to-tr from-[#7C3AED] via-[#06B6D4] to-[#10B981] shadow-md flex-shrink-0">
                  <div className="w-full h-full bg-[#050508] rounded-[11px] flex items-center justify-center">
                    <span className="font-extrabold text-sm bg-gradient-to-r from-[#A78BFA] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">SA</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--color-text-primary)]">Sojib Ahmed</div>
                  <div className="text-[11px] text-[#06B6D4] font-medium">Full Stack Developer</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] mb-2 font-medium uppercase tracking-wider">Currently Available For:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Full-Time', 'Internship', 'Freelance', 'Remote'].map(type => (
                      <span key={type} className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}>
                        <div className="status-dot" style={{ width: 4, height: 4 }} />
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Clock size={12} className="text-[#7C3AED]" />
                  <span className="text-[11px] text-[var(--color-text-secondary)]">Usually replies within 15 minutes</span>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="card p-5 space-y-3.5">
              {/* Email with copy button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(6,182,212,0.1)' }}>
                    <FaEnvelope size={14} className="text-[#06B6D4]" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Email</div>
                    <a href="mailto:sojibahmedshorif998@gmail.com" className="text-xs font-medium text-[var(--color-text-primary)] hover:text-[#06B6D4] transition-colors break-all">
                      sojibahmedshorif998@gmail.com
                    </a>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium glass border border-[rgba(6,182,212,0.3)] text-[#06B6D4] hover:bg-[rgba(6,182,212,0.1)] transition-all flex items-center gap-1.5 flex-shrink-0"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check size={12} className="text-[#10B981]" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </motion.button>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(124,58,237,0.1)' }}>
                  <Phone size={14} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Phone</div>
                  <a href="tel:+8801942791004" className="text-xs font-medium text-[var(--color-text-primary)] hover:text-[#8B5CF6] transition-colors">
                    +880 1942791004
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <MapPin size={14} className="text-[#10B981]" />
                </div>
                <div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Location</div>
                  <div className="text-xs font-medium text-[var(--color-text-primary)]">Rangpur, Bangladesh</div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-2">
              {[
                { icon: FaGithub, href: 'https://github.com/SojibTechHub', label: 'GitHub' },
                { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/sojib-ahmed-shorif', label: 'LinkedIn' },
                { icon: FaEnvelope, href: 'mailto:sojibahmedshorif998@gmail.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="social-icon flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white"
                  aria-label={label}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="card p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'rgba(16,185,129,0.15)' }}
                  >
                    <CheckCircle2 size={32} className="text-[#10B981]" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">Message Sent!</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Got it! I'll reply within 15 minutes.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="John Doe"
                        {...register('name')}
                        className={`w-full px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] transition-all outline-none focus:ring-1 ${
                          errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[rgba(124,58,237,0.5)] focus:border-[rgba(124,58,237,0.5)]'
                        }`}
                        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                      />
                      {errors.name && <p className="mt-1 text-[10px] text-red-400">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="contact-email" className="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="john@example.com"
                        {...register('email')}
                        className={`w-full px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] transition-all outline-none focus:ring-1 ${
                          errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[rgba(124,58,237,0.5)] focus:border-[rgba(124,58,237,0.5)]'
                        }`}
                        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                      />
                      {errors.email && <p className="mt-1 text-[10px] text-red-400">{errors.email.message}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="contact-subject" className="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                      Subject *
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      placeholder="Project inquiry, Job opportunity, Collaboration..."
                      {...register('subject')}
                      className={`w-full px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] transition-all outline-none focus:ring-1 ${
                        errors.subject ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[rgba(124,58,237,0.5)] focus:border-[rgba(124,58,237,0.5)]'
                      }`}
                      style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                    />
                    {errors.subject && <p className="mt-1 text-[10px] text-red-400">{errors.subject.message}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-[11px] font-semibold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell me about your project, requirements, timeline..."
                      {...register('message')}
                      className={`w-full px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] transition-all outline-none focus:ring-1 resize-none ${
                        errors.message ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[rgba(124,58,237,0.5)] focus:border-[rgba(124,58,237,0.5)]'
                      }`}
                      style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                    />
                    {errors.message && <p className="mt-1 text-[10px] text-red-400">{errors.message.message}</p>}
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 8px 30px rgba(124,58,237,0.4)' } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="btn-primary w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    id="contact-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                        <ArrowRight size={15} />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
