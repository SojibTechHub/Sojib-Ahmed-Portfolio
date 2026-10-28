// ============================
// CERTIFICATES & CREDENTIALS DATA
// ============================

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  date: string;
  duration: string;
  skills: string[];
  verifyUrl: string;
  credentialId: string;
  color: string;
  featured: boolean;
}

export const certificates: Certificate[] = [
  {
    id: 'flyrank-offer-letter',
    title: 'Full Stack Web Development Appointment',
    issuer: 'FlyRank',
    issuerLogo: '🚀',
    date: '2026 Cohort',
    duration: 'Official Engineering Offer Letter',
    skills: ['Full Stack MERN', 'Next.js', 'REST APIs', 'System Architecture', 'Production Deployment'],
    verifyUrl: 'https://drive.google.com/file/d/10ONRQsFH14NB1RvG7aJIltzSm6YGXqcy/view?usp=sharing',
    credentialId: 'FLYRANK-2026-ENG-SOJIB',
    color: '#06B6D4',
    featured: true,
  },
  {
    id: 'ph-complete-web-dev',
    title: 'Complete Web Development Course',
    issuer: 'Programming Hero',
    issuerLogo: '🦸',
    date: 'January 2026 – August 2026',
    duration: '8 Months Intensive Training',
    skills: ['MERN Stack', 'JavaScript (ES6+)', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'Firebase', 'TypeScript', 'Tailwind CSS'],
    verifyUrl: 'https://drive.google.com/file/d/1xthcbztqypL5RCzst-gNL4bg4eMNFWyK/view?usp=sharing',
    credentialId: 'PH-2026-MERN-SOJIB',
    color: '#7C3AED',
    featured: false,
  },
  {
    id: 'mongodb-associate',
    title: 'MongoDB Associate Developer',
    issuer: 'MongoDB University',
    issuerLogo: '🍃',
    date: '2026',
    duration: 'Comprehensive Path',
    skills: ['MongoDB Atlas', 'Aggregation Pipeline', 'Data Modeling', 'Indexing', 'Mongoose'],
    verifyUrl: 'https://drive.google.com/file/d/1xthcbztqypL5RCzst-gNL4bg4eMNFWyK/view?usp=sharing',
    credentialId: 'MDB-2026-DEV',
    color: '#47A248',
    featured: false,
  },
  {
    id: 'react-developer',
    title: 'React & Frontend Architecture',
    issuer: 'Meta & Open Source Certification',
    issuerLogo: '⚛️',
    date: '2026',
    duration: 'Advanced Specialization',
    skills: ['React 19', 'Custom Hooks', 'TanStack Query', 'Framer Motion', 'State Management'],
    verifyUrl: 'https://drive.google.com/file/d/1xthcbztqypL5RCzst-gNL4bg4eMNFWyK/view?usp=sharing',
    credentialId: 'META-REACT-2026',
    color: '#61DAFB',
    featured: false,
  },
  {
    id: 'git-github',
    title: 'Git & DevOps Mastery',
    issuer: 'GitHub Education',
    issuerLogo: '🐙',
    date: '2026',
    duration: 'CI/CD & Collaboration',
    skills: ['Git Flow', 'GitHub Actions', 'CI/CD Pipelines', 'Docker', 'Automated Deployment'],
    verifyUrl: 'https://drive.google.com/file/d/1xthcbztqypL5RCzst-gNL4bg4eMNFWyK/view?usp=sharing',
    credentialId: 'GH-2026-GIT',
    color: '#F05032',
    featured: false,
  },
];
