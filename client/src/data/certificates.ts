// ============================
// CERTIFICATES & CREDENTIALS DATA
// ============================

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  badgeText: string;
  date: string;
  duration: string;
  skills: string[];
  verifyUrl: string;
  downloadUrl?: string;
  credentialId: string;
  color: string;
  image?: string;
  featured?: boolean;
}

export const certificates: Certificate[] = [
  {
    id: 'flyrank-offer-letter',
    title: 'Full Stack Web Development Appointment',
    issuer: 'FlyRank',
    issuerLogo: '🚀',
    badgeText: 'Official Offer of Appointment',
    date: '2026 Cohort',
    duration: 'Engineering Appointment & Offer Letter',
    skills: ['Full Stack MERN', 'Next.js 15', 'REST APIs', 'System Architecture', 'Production Deployment'],
    verifyUrl: 'https://drive.google.com/file/d/10ONRQsFH14NB1RvG7aJIltzSm6YGXqcy/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/file/d/10ONRQsFH14NB1RvG7aJIltzSm6YGXqcy/view?usp=sharing',
    credentialId: 'FLYRANK-2026-ENG-SOJIB',
    color: '#06B6D4',
    image: '/images/github_featured_banner.jpg',
    featured: true,
  },
  {
    id: 'ph-complete-web-dev',
    title: 'Complete Web Development Course',
    issuer: 'Programming Hero',
    issuerLogo: '🏆',
    badgeText: 'Certificate of Excellence (Batch 13)',
    date: 'Batch 13 · 2026',
    duration: 'Full-Stack Engineering Specialization',
    skills: ['MERN Stack', 'JavaScript (ES6+)', 'React.js', 'Node.js', 'Express.js', 'MongoDB Atlas', 'TypeScript'],
    verifyUrl: 'https://drive.google.com/file/d/1xthcbztqypL5RCzst-gNL4bg4eMNFWyK/view?usp=sharing',
    downloadUrl: 'https://drive.google.com/file/d/1xthcbztqypL5RCzst-gNL4bg4eMNFWyK/view?usp=sharing',
    credentialId: 'PH-BATCH13-2026-SOJIB',
    color: '#7C3AED',
    image: '/certificates/certificate.png',
    featured: true,
  },
  {
    id: 'datheon-internship',
    title: 'Full Stack Engineering Internship',
    issuer: 'Datheon AI Systems',
    issuerLogo: '⚡',
    badgeText: 'Verified Industry Internship',
    date: '2026 Verified Record',
    duration: 'Industry Full-Stack Engineering Internship',
    skills: ['Full Stack Architecture', 'React 19', 'Node.js APIs', 'MongoDB Atlas', 'Cloud Integration'],
    verifyUrl: 'https://datheon.in/verify?id=DT-2026-33B1M',
    downloadUrl: 'https://datheon.in/verify?id=DT-2026-33B1M',
    credentialId: 'DT-2026-33B1M',
    color: '#10B981',
    image: '/images/linkedin_featured_banner.jpg',
    featured: true,
  },
];
