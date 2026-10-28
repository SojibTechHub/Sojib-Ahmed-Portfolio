import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GitBranch, Star, GitFork, ArrowRight, Activity } from 'lucide-react';

const pinnedRepos = [
  {
    name: 'investprop-ai',
    description: 'AI-powered real estate investment platform with personalized recommendations and market analysis',
    language: 'TypeScript',
    langColor: '#3178C6',
    stars: 12,
    forks: 3,
    topics: ['React', 'Node.js', 'MongoDB', 'AI'],
  },
  {
    name: 'job-finder-app',
    description: 'Full-stack job portal with real-time application tracking, employer dashboard, and smart filtering',
    language: 'JavaScript',
    langColor: '#F7DF1E',
    stars: 8,
    forks: 2,
    topics: ['MERN', 'JWT', 'Firebase'],
  },
  {
    name: 'pet-adoption-platform',
    description: 'Community-driven pet adoption system with admin workflow and image upload management',
    language: 'JavaScript',
    langColor: '#F7DF1E',
    stars: 6,
    forks: 1,
    topics: ['React', 'Express', 'MongoDB'],
  },
];

const contributions = [
  [3, 0, 1, 2, 4, 0, 1],
  [0, 2, 3, 1, 0, 3, 2],
  [4, 1, 0, 3, 2, 1, 0],
  [0, 3, 2, 1, 4, 0, 3],
  [1, 0, 4, 2, 0, 3, 1],
  [3, 2, 0, 4, 1, 0, 2],
  [0, 1, 3, 0, 2, 4, 1],
  [2, 0, 1, 3, 0, 2, 3],
  [1, 3, 2, 0, 4, 1, 0],
  [0, 2, 0, 1, 3, 2, 4],
  [3, 1, 4, 0, 1, 3, 0],
  [2, 0, 3, 4, 0, 2, 1],
];

const intensityColors = ['#1A1A2E', '#2D1B69', '#4C1D95', '#7C3AED', '#8B5CF6'];

export default function GitHub() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="github" className="section-padding relative" ref={ref}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-badge mx-auto w-fit mb-3">
            <span>🔨</span> GitHub
          </div>
          <h2 className="section-heading">Building in Public</h2>
          <p className="section-subheading mx-auto text-center">
            Open source and public repositories showcasing real-world projects.
          </p>
        </motion.div>

        {/* Contribution Graph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-[#10B981]" />
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Contribution Activity</span>
            <span className="text-xs text-[var(--color-text-secondary)] ml-auto">200+ contributions in 2026</span>
          </div>

          {/* Graph */}
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {contributions.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((intensity, di) => (
                    <motion.div
                      key={`${wi}-${di}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: (wi * 7 + di) * 0.003 }}
                      className="w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-125"
                      style={{ background: intensityColors[intensity] }}
                      title={`${intensity} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-xs text-[var(--color-text-secondary)]">Less</span>
            {intensityColors.map((color) => (
              <div key={color} className="w-3 h-3 rounded-sm" style={{ background: color }} />
            ))}
            <span className="text-xs text-[var(--color-text-secondary)]">More</span>
          </div>
        </motion.div>

        {/* Pinned Repos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pinnedRepos.map((repo, i) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -6 }}
              className="card p-5 group"
            >
              <div className="flex items-center gap-2 mb-3">
                <GitBranch size={16} className="text-[var(--color-text-secondary)]" />
                <span className="text-sm font-bold text-[#8B5CF6] group-hover:text-[#7C3AED] transition-colors">{repo.name}</span>
              </div>

              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">{repo.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {repo.topics.map(topic => (
                  <span key={topic} className="tech-badge text-[10px]">{topic}</span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: repo.langColor }} />
                    {repo.language}
                  </div>
                  <div className="flex items-center gap-1"><Star size={11} />{repo.stars}</div>
                  <div className="flex items-center gap-1"><GitFork size={11} />{repo.forks}</div>
                </div>
                <a
                  href={`https://github.com/SojibTechHub/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#8B5CF6] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  id={`github-repo-${repo.name}`}
                >
                  View <ArrowRight size={11} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <motion.a
            href="https://github.com/SojibTechHub"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary inline-flex"
            id="github-profile-link"
          >
            <GitBranch size={16} />
            View GitHub Profile
            <ArrowRight size={15} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
