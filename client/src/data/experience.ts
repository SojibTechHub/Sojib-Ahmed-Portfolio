// ============================
// EXPERIENCE / TIMELINE DATA
// ============================

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'education' | 'certification' | 'milestone';
  skills?: string[];
  highlight?: boolean;
}

export const timeline: TimelineItem[] = [
  {
    id: 'hsc',
    date: '2025 – Present',
    title: 'Higher Secondary Certificate (HSC)',
    subtitle: 'Science Group | 2nd Year Running',
    description: 'Currently pursuing HSC with a focus on science subjects, building a strong analytical and problem-solving foundation.',
    type: 'education',
    highlight: false,
  },
  {
    id: 'ssc',
    date: '2025',
    title: 'Secondary School Certificate (SSC)',
    subtitle: 'Science | Rowmari High School | GPA: 4.50 / 5.00',
    description: 'Completed SSC with strong academic standing in science, mastering core mathematical and logical foundations.',
    type: 'education',
    highlight: false,
  },
  {
    id: 'ph-certification',
    date: 'Jan 2026 – Aug 2026',
    title: 'Complete Web Development Course',
    subtitle: 'Programming Hero | Full-Stack Engineering Program',
    description: 'Completed an intensive full-stack web development program covering the complete MERN stack ecosystem from fundamentals to production-grade applications.',
    type: 'certification',
    skills: ['MERN Stack', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js'],
    highlight: true,
  },
  {
    id: 'jan2026',
    date: 'Jan 2026',
    title: 'Started Web Development Journey',
    subtitle: 'First Lines of Code',
    description: 'Began the exciting journey into web development with a clear goal: to build modern, impactful applications.',
    type: 'milestone',
  },
  {
    id: 'feb2026',
    date: 'Feb 2026',
    title: 'Mastered HTML, CSS & JavaScript',
    subtitle: 'Frontend Foundations',
    description: 'Built a rock-solid foundation in web fundamentals — semantic HTML, responsive CSS, and modern JavaScript (ES6+).',
    type: 'milestone',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
  },
  {
    id: 'mar2026',
    date: 'Mar 2026',
    title: 'React.js & Frontend Development',
    subtitle: 'Component-Based Architecture',
    description: 'Mastered React.js — components, hooks, state management, and building dynamic single-page applications.',
    type: 'milestone',
    skills: ['React.js', 'Hooks', 'SPA', 'Tailwind CSS'],
  },
  {
    id: 'apr2026',
    date: 'Apr 2026',
    title: 'Backend Development with Node.js & Express',
    subtitle: 'Server-Side Development',
    description: 'Learned server-side development — building REST APIs, middleware architecture, and backend business logic.',
    type: 'milestone',
    skills: ['Node.js', 'Express.js', 'REST API', 'Middleware'],
  },
  {
    id: 'may2026',
    date: 'May 2026',
    title: 'Database Design with MongoDB & Mongoose',
    subtitle: 'Data Persistence & Modeling',
    description: 'Mastered NoSQL database design — schemas, aggregations, indexing, and efficient data modeling with Mongoose.',
    type: 'milestone',
    skills: ['MongoDB', 'Mongoose', 'Database Design', 'Aggregation'],
  },
  {
    id: 'jun2026',
    date: 'Jun 2026',
    title: 'Full Stack Project Development',
    subtitle: 'End-to-End Applications',
    description: 'Started building complete, production-ready full-stack applications from design to deployment.',
    type: 'milestone',
    skills: ['MERN Stack', 'Full Stack', 'Deployment', 'Vercel', 'Render'],
    highlight: true,
  },
  {
    id: 'jul2026',
    date: 'Jul 2026',
    title: 'Authentication Systems',
    subtitle: 'JWT, Firebase & OAuth',
    description: 'Implemented secure authentication systems with JWT, Firebase Auth, OAuth 2.0, and role-based access control.',
    type: 'milestone',
    skills: ['JWT', 'Firebase Auth', 'OAuth', 'RBAC', 'Bcrypt'],
  },
  {
    id: 'aug2026',
    date: 'Aug 2026',
    title: 'AI Integration & Advanced Technologies',
    subtitle: 'Next-Gen Features',
    description: 'Integrated AI capabilities using Gemini and OpenAI APIs, building intelligent chatbots and AI-powered features.',
    type: 'milestone',
    skills: ['Gemini API', 'OpenAI', 'AI Chatbot', 'RAG', 'TypeScript'],
    highlight: true,
  },
  {
    id: 'present',
    date: 'Present',
    title: 'Building Production-Ready Applications',
    subtitle: 'Full Stack Developer | Available for Opportunities',
    description: 'Actively building scalable, high-performance web applications and open to full-time, freelance, and remote opportunities.',
    type: 'milestone',
    skills: ['Full Stack', 'MERN', 'AI Integration', 'System Design'],
    highlight: true,
  },
];
