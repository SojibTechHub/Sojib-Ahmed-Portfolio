import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, ArrowRight, Layers, Code, Server, Key, ChevronLeft, ChevronRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { projects as defaultProjects, type Project } from '../../data/projects';

type Category = 'all' | 'full-stack' | 'frontend' | 'backend';

const categoryIcons = {
  'all': Layers,
  'full-stack': Layers,
  'frontend': Code,
  'backend': Server,
};

const categoryLabels = {
  'all': 'All Projects (3 Pages)',
  'full-stack': 'Full Stack (Page 1)',
  'frontend': 'Frontend (Page 2)',
  'backend': 'Backend (Page 3)',
};

const projectImageMap: Record<string, string> = {
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

const getProjectImage = (title?: string, id?: string, img?: string) => {
  if (img && !img.includes('hero.jpg')) return img;
  const key = `${id || ''} ${title || ''}`.toLowerCase();
  for (const [k, v] of Object.entries(projectImageMap)) {
    if (key.includes(k)) return v;
  }
  return '/images/shopx.png';
};

export default function Projects() {
  const [projectList, setProjectList] = useState<Project[]>(defaultProjects);
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    // Check localStorage first
    try {
      const saved = localStorage.getItem('sojib_custom_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasStaleHero = parsed.some((p: any) => p.image && p.image.includes('hero.jpg'));
          if (hasStaleHero) {
            localStorage.removeItem('sojib_custom_projects');
          } else {
            setProjectList(parsed);
          }
        }
      }
    } catch {}

    const fetchLiveProjects = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/projects`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProjectList(data.data);
          try {
            localStorage.setItem('sojib_custom_projects', JSON.stringify(data.data));
          } catch {}
        }
      } catch {
        // Fallback to defaultProjects
      }
    };
    fetchLiveProjects();
  }, []);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  // Separate into 3 clean pages:
  // Page 1: 4 Full-Stack Flagship Projects
  // Page 2: 3 Modern Frontend Projects
  // Page 3: 3 High-Performance Backend Projects
  const fullStackProjects = projectList.filter(p => p.category === 'full-stack');
  const frontendProjects = projectList.filter(p => p.category === 'frontend');
  const backendProjects = projectList.filter(p => p.category === 'backend');

  // Determine which projects to show based on filter and page
  let displayedProjects: Project[] = [];
  if (activeFilter === 'full-stack') {
    displayedProjects = fullStackProjects;
  } else if (activeFilter === 'frontend') {
    displayedProjects = frontendProjects;
  } else if (activeFilter === 'backend') {
    displayedProjects = backendProjects;
  } else {
    // 'all' filter with 3 distinct pages
    if (currentPage === 1) displayedProjects = fullStackProjects;
    else if (currentPage === 2) displayedProjects = frontendProjects;
    else if (currentPage === 3) displayedProjects = backendProjects;
    else displayedProjects = fullStackProjects;
  }

  const handleFilterClick = (cat: Category) => {
    setActiveFilter(cat);
    if (cat === 'full-stack') setCurrentPage(1);
    else if (cat === 'frontend') setCurrentPage(2);
    else if (cat === 'backend') setCurrentPage(3);
    else setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    if (page === 1) setActiveFilter('all');
    else if (page === 2) setActiveFilter('all');
    else if (page === 3) setActiveFilter('all');
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="section-padding relative" ref={ref}>
      {/* Background orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 orb orb-cyan opacity-08 pointer-events-none" aria-hidden="true" />

      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-badge mx-auto w-fit mb-3">
            <span>🚀</span> Portfolio
          </div>
          <h2 className="section-heading">Featured & Production Projects</h2>
          <p className="section-subheading mx-auto text-center max-w-2xl">
            A showcase of enterprise full-stack systems, modern frontend applications, and high-performance backend API gateways. Click any project to view full architecture & live demo.
          </p>
        </motion.div>

        {/* Filter / Page Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
          role="tablist"
          aria-label="Project category filter"
        >
          {(['all', 'full-stack', 'frontend', 'backend'] as Category[]).map((cat) => {
            const Icon = categoryIcons[cat];
            const isActive = activeFilter === cat || (activeFilter === 'all' && (
              (cat === 'full-stack' && currentPage === 1) ||
              (cat === 'frontend' && currentPage === 2) ||
              (cat === 'backend' && currentPage === 3)
            ));

            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleFilterClick(cat)}
                role="tab"
                aria-selected={isActive}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? 'text-white border-primary shadow-[0_0_20px_rgba(124,58,237,0.4)]'
                    : 'text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)] hover:border-primary/40 bg-[var(--color-surface)]/60'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                } : undefined}
                id={`filter-${cat}`}
              >
                <Icon size={15} />
                <span>{categoryLabels[cat]}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-[var(--color-text-secondary)]'
                }`}>
                  {cat === 'all' ? projectList.length : projectList.filter((p: any) => p.category === cat).length}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Compact Projects Grid (Choto kore, tap korle modal open hoy) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 lg:gap-8"
          >
            {displayedProjects.map((project, i) => (
              <motion.article
                key={project.id || (project as any)._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                onClick={() => setSelectedProject(project)}
                className="project-card card group relative overflow-hidden flex flex-col justify-between cursor-pointer border border-white/10 hover:border-[#06B6D4]/60 transition-all duration-300 shadow-lg hover:shadow-[0_12px_35px_rgba(6,182,212,0.15)] rounded-2xl bg-[var(--color-surface)]"
                style={{
                  '--project-color': project.color || '#06B6D4',
                } as React.CSSProperties}
                aria-label={`${project.title} - ${project.subtitle}`}
              >
                {/* Top accent line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[2.5px] transition-all duration-500 z-10"
                  style={{
                    background: hoveredProject === (project.id || (project as any)._id)
                      ? `linear-gradient(90deg, ${project.color || '#06B6D4'}, ${project.accentColor || '#7C3AED'})`
                      : `linear-gradient(90deg, ${project.color || '#06B6D4'}60, transparent)`,
                  }}
                />

                <div>
                  {/* Compact Preview Image */}
                  <div className="w-full h-44 sm:h-48 relative overflow-hidden bg-[#070b14]">
                    <img 
                      src={getProjectImage(project.title, project.id, project.image)} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/shopx.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-90 pointer-events-none" />

                    {/* Category pill & year on image */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-[#06B6D4] border border-[#06B6D4]/40 shadow">
                        {project.category === 'full-stack' ? 'Full Stack' : project.category === 'frontend' ? 'Frontend' : 'Backend'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-gray-300 border border-white/10">
                        {project.year || '2026'}
                      </span>
                    </div>

                    {/* Quick tap indicator hint on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="px-3.5 py-1.5 rounded-full bg-black/80 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 border border-[#06B6D4]/50 shadow-xl text-[#06B6D4]">
                        <Sparkles size={14} className="text-[#06B6D4]" />
                        <span>Tap to View Details & Live Demo</span>
                      </span>
                    </div>
                  </div>

                  {/* Compact Card Content */}
                  <div className="p-5 sm:p-6 pb-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[#06B6D4] transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <div 
                        className="text-2xl font-black opacity-15 font-mono select-none flex-shrink-0"
                        style={{ color: project.color }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed mb-4">
                      {project.subtitle}
                    </p>

                    {/* Primary Tech Badges (Compact 3-4 items) */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(project.techStack || []).slice(0, 4).map((tech) => (
                        <span key={tech} className="tech-badge text-[10px] py-0.5 px-2">
                          {tech}
                        </span>
                      ))}
                      {(project.techStack || []).length > 4 && (
                        <span className="text-[10px] font-mono py-0.5 px-2 rounded-full bg-white/5 text-gray-400 border border-white/5">
                          +{(project.techStack || []).length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compact Card Action Footer */}
                <div 
                  className="px-5 sm:px-6 py-3.5 flex items-center justify-between gap-2 border-t border-[var(--color-border)]/50 bg-black/20 mt-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Tap for Details Button */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#06B6D4] hover:text-white transition-colors cursor-pointer group/btn"
                  >
                    <span>View Details & Demo</span>
                    <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>

                  {/* Direct Link Action Icons */}
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#06B6D4]/15 hover:bg-[#06B6D4]/30 border border-[#06B6D4]/40 text-[#06B6D4] transition-all hover:scale-105"
                        title="Open Live App"
                        aria-label="Open Live App"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all hover:scale-105"
                        title="GitHub Repository"
                        aria-label="GitHub Repository"
                      >
                        <FaGithub size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* 3-Page Pagination Controls (4 projects on page 1, 3 on page 2, 3 on page 3) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-border)] shadow-xl"
        >
          {/* Current Page Info */}
          <div className="flex items-center gap-2.5 text-xs text-[var(--color-text-secondary)] font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] animate-pulse flex-shrink-0" />
            <div>
              <span>Page <strong className="text-white font-bold">{currentPage}</strong> of <strong>3</strong></span>
              <span className="mx-2 text-gray-500">·</span>
              <span className="text-[#06B6D4] font-semibold">
                {currentPage === 1 && 'Flagship Full-Stack Systems (4 Projects)'}
                {currentPage === 2 && 'Modern Frontend Applications (3 Projects)'}
                {currentPage === 3 && 'High-Performance Backend Gateways (3 Projects)'}
              </span>
            </div>
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-[var(--color-surface)] border-[var(--color-border)] text-gray-300 hover:text-white hover:border-primary/50 shadow-sm"
              aria-label="Previous Page"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            {[1, 2, 3].map((pageNum) => {
              const isSelected = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-sm ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                      : 'bg-[var(--color-surface)] text-gray-400 hover:text-white border border-[var(--color-border)] hover:border-primary/40'
                  }`}
                  aria-label={`Go to Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(Math.min(3, currentPage + 1))}
              disabled={currentPage === 3}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-[var(--color-surface)] border-[var(--color-border)] text-gray-300 hover:text-white hover:border-primary/50 shadow-sm"
              aria-label="Next Page"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>

        {/* More projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            All projects are available on GitHub with complete source code and documentation.
          </p>
          <motion.a
            href="https://github.com/SojibTechHub"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(124,58,237,0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            id="view-all-github"
          >
            <FaGithub size={17} />
            <span>View All Repositories on GitHub</span>
            <ArrowRight size={15} />
          </motion.a>
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE PROJECT DETAILS MODAL (Tap korle sob detail)   */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0a0f1d] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-left flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg"
                title="Close (Esc)"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Large Image Banner */}
              <div className="relative w-full h-56 sm:h-72 overflow-hidden bg-[#050811] flex-shrink-0">
                <img
                  src={getProjectImage(selectedProject.title, selectedProject.id, selectedProject.image)}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/30 to-transparent" />

                {/* Badges on Banner */}
                <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#06B6D4] border border-[#06B6D4]/50 shadow">
                      {selectedProject.category === 'full-stack' ? 'Full Stack System' : selectedProject.category === 'frontend' ? 'Frontend Application' : 'Backend Gateway'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/80 backdrop-blur-md text-gray-300 border border-white/15">
                      {selectedProject.year || '2026'}
                    </span>
                  </div>

                  {selectedProject.role && (
                    <span className="text-xs font-medium text-gray-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      Role: <strong className="text-white">{selectedProject.role}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
                {/* Title & Subtitle */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {selectedProject.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 mt-1 leading-relaxed">
                    {selectedProject.subtitle}
                  </p>
                </div>

                {/* Problem & Solution Callout Boxes */}
                {(selectedProject.problem || selectedProject.solution) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.problem && (
                      <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs sm:text-sm">
                        <div className="font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span>The Challenge:</span>
                        </div>
                        <p className="text-rose-200/90 leading-relaxed">
                          {selectedProject.problem}
                        </p>
                      </div>
                    )}

                    {selectedProject.solution && (
                      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs sm:text-sm">
                        <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>Architected Solution:</span>
                        </div>
                        <p className="text-emerald-200/90 leading-relaxed">
                          {selectedProject.solution}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Demo Login Credentials Box (if applicable) */}
                {(selectedProject as any).credentials && (
                  <div className="p-4 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/40 text-xs sm:text-sm">
                    <div className="font-bold text-[#06B6D4] flex items-center gap-2 mb-2">
                      <Key size={15} />
                      <span>Verified Demo Login Credentials (Ready to Test):</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs text-gray-300">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-sans">User Access</span>
                        <span className="text-white font-bold select-all">{(selectedProject as any).credentials.user}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-sans">Admin / Reviewer</span>
                        <span className="text-white font-bold select-all">{(selectedProject as any).credentials.admin}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Architectural Features Bullet List */}
                {Array.isArray(selectedProject.features) && selectedProject.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-2">
                      <Sparkles size={14} className="text-[#06B6D4]" />
                      <span>Key Engineering Highlights:</span>
                    </h3>
                    <ul className="space-y-2">
                      {selectedProject.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed">
                          <CheckCircle2 size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Complete Tech Stack Badges */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                    Complete Technology Stack:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProject.techStack || []).map((tech) => (
                      <span key={tech} className="tech-badge text-xs py-1 px-3">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Action Footer Bar (Live Link & GitHub buttons) */}
              <div className="p-5 sm:p-6 bg-black/50 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 mt-auto">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                >
                  Close Window
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  {/* GitHub Repo Button */}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#131c2e] hover:bg-[#1e2a42] border border-white/20 hover:border-[#06B6D4]/50 transition-all shadow-md"
                    >
                      <FaGithub size={16} />
                      <span>GitHub Repository</span>
                    </a>
                  )}

                  {/* Secondary Repo if available */}
                  {selectedProject.docsUrl && (
                    <a
                      href={selectedProject.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                      <FaGithub size={14} />
                      <span>{selectedProject.category === 'backend' ? 'Client Repo' : 'Server Repo'}</span>
                    </a>
                  )}

                  {/* Prominent Live Link Button */}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                      }}
                    >
                      <span>Open Live Application</span>
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
