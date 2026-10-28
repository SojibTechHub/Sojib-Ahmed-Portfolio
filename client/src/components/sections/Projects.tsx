import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, ArrowRight, Layers, Code, Server, Key, ChevronLeft, ChevronRight } from 'lucide-react';
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
            A showcase of enterprise full-stack systems, modern frontend applications, and high-performance backend API gateways.
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

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10"
          >
            {displayedProjects.map((project, i) => (
              <motion.article
                key={project.id || (project as any)._id}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="project-card card group relative overflow-hidden flex flex-col justify-between"
                style={{
                  '--project-color': project.color || '#06B6D4',
                } as React.CSSProperties}
                aria-label={`${project.title} - ${project.subtitle}`}
              >
                {/* Top color line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 z-10"
                  style={{
                    background: hoveredProject === (project.id || (project as any)._id)
                      ? `linear-gradient(90deg, ${project.color || '#06B6D4'}, ${project.accentColor || '#7C3AED'})`
                      : `linear-gradient(90deg, ${project.color || '#06B6D4'}50, transparent)`,
                  }}
                />

                <div>
                  <div className="project-card-image w-full h-52 sm:h-64 relative overflow-hidden bg-[#0a0f1d]">
                    <img 
                      src={getProjectImage(project.title, project.id, project.image)} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/shopx.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-90 pointer-events-none" />
                  </div>

                  <div className="p-6 md:p-8 pt-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        {/* Category badge */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="tech-badge text-[10px] uppercase tracking-wider font-bold">
                            {project.category === 'full-stack' ? 'Full Stack' : project.category === 'frontend' ? 'Frontend' : 'Backend'}
                          </span>
                          <span className="text-[11px] text-[var(--color-text-secondary)] font-mono">{project.year}</span>
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">{project.subtitle}</p>
                      </div>

                      {/* Number */}
                      <div 
                        className="text-3xl font-black opacity-15 font-mono select-none"
                        style={{ color: project.color }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Problem / Solution */}
                    {(project.problem || project.solution) && (
                      <div className="mb-4 space-y-2 text-xs leading-relaxed">
                        {project.problem && (
                          <div className="flex items-start gap-2 text-[var(--color-text-secondary)]">
                            <span className="text-[#EC4899] font-bold flex-shrink-0">Problem:</span>
                            <span>{project.problem}</span>
                          </div>
                        )}
                        {project.solution && (
                          <div className="flex items-start gap-2 text-[var(--color-text-primary)]">
                            <span className="text-[#10B981] font-bold flex-shrink-0">Solution:</span>
                            <span>{project.solution}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Demo Credentials if applicable */}
                    {(project as any).credentials && (
                      <div className="mb-4 p-3 rounded-xl bg-[#3178C6]/10 border border-[#3178C6]/30 text-xs text-[#93C5FD]">
                        <div className="font-semibold text-white flex items-center gap-1.5 mb-1 text-[11px]">
                          <Key size={13} className="text-[#60A5FA]" />
                          <span>Demo Login Credentials:</span>
                        </div>
                        <div className="font-mono text-[11px] text-gray-300 space-y-0.5">
                          <div><strong className="text-white">User:</strong> {(project as any).credentials.user}</div>
                          <div><strong className="text-white">Admin:</strong> {(project as any).credentials.admin}</div>
                        </div>
                      </div>
                    )}

                    {/* Key Features bullet points */}
                    {Array.isArray(project.features) && project.features.length > 0 && (
                      <div className="space-y-1.5 mb-5">
                        {project.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: project.color || '#06B6D4' }} />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(project.techStack || []).map((tech) => (
                        <span key={tech} className="tech-badge text-[10px]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer with Clear Labeled Action Buttons */}
                <div className="px-6 md:px-8 pb-6 pt-0 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)]/50 pt-4 mt-auto">
                  <span className="text-[11px] text-[var(--color-text-secondary)]">
                    Role: <span className="text-[var(--color-text-primary)] font-medium">{project.role || 'Full Stack Developer'}</span>
                  </span>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Live Link Button */}
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_22px_rgba(124,58,237,0.5)] transition-all duration-200"
                        style={{
                          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                        }}
                        aria-label={`${project.title} Live Link`}
                      >
                        <ExternalLink size={14} className="text-white flex-shrink-0" />
                        <span>Live Link</span>
                      </motion.a>
                    )}

                    {/* GitHub Link Button with Official GitHub Logo */}
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-[#1e293b] border border-[var(--color-border)] hover:border-primary/50 transition-all duration-200 shadow-sm"
                        aria-label={`${project.title} GitHub Link`}
                      >
                        <FaGithub size={15} className="text-white flex-shrink-0" />
                        <span>GitHub Link</span>
                      </motion.a>
                    )}

                    {/* Secondary Repo if available */}
                    {project.docsUrl && (
                      <motion.a
                        href={project.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-mono text-[var(--color-text-secondary)] hover:text-white bg-[#0f172a]/60 border border-[var(--color-border)] hover:border-primary/40 transition-colors"
                        aria-label={`${project.title} Secondary Repo`}
                      >
                        <FaGithub size={13} />
                        <span>{project.category === 'backend' ? 'Client' : 'Server'}</span>
                      </motion.a>
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
            href="https://github.com/sojibahmedshorif25-ai"
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
    </section>
  );
}
