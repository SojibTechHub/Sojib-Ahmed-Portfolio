// ============================
// AUTHENTIC SKILLS & TECH STACK (Derived from All 10 Production Repositories)
// ============================

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai-services';
  description: string;
  color: string;
  experienceLevel?: string;
  repoProof?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

export const allSkillsList: Skill[] = [
  // --- FRONTEND (11 Skills) ---
  {
    name: 'React 19 / React.js',
    category: 'frontend',
    description: 'Modern Server/Client Components, Custom Hooks, Virtual DOM, and Suspense Architecture.',
    color: '#61DAFB',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD, SkillForge, StartupForge, TypeMarket, FoodFlow',
  },
  {
    name: 'Next.js 15 & 16',
    category: 'frontend',
    description: 'App Router, Server-Side Rendering (SSR), SSG, Server Actions, and Route Handlers.',
    color: '#ffffff',
    experienceLevel: 'Advanced',
    repoProof: 'FoodFlow, SkillForge',
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    description: 'End-to-end type safety, generics, strict interface contracts, and utility types.',
    color: '#3178C6',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD, FoodFlow, SkillForge, TypeMarket, InvestProp AI',
  },
  {
    name: 'JavaScript (ES6+)',
    category: 'frontend',
    description: 'Asynchronous event loop, closures, promises, prototypes, and modern Web APIs.',
    color: '#F7DF1E',
    experienceLevel: 'Advanced',
    repoProof: 'Used across all 10 repositories',
  },
  {
    name: 'Tailwind CSS v4',
    category: 'frontend',
    description: 'Utility-first CSS, custom design systems, responsive layouts, and dark mode theming.',
    color: '#06B6D4',
    experienceLevel: 'Expert',
    repoProof: 'ShopX BD, FoodFlow, SkillForge, StartupForge, TypeMarket',
  },
  {
    name: 'TanStack Query (React Query)',
    category: 'frontend',
    description: 'Asynchronous server state caching, background polling, and optimistic UI mutations.',
    color: '#FF4154',
    experienceLevel: 'Advanced',
    repoProof: 'SkillForge, TypeMarket',
  },
  {
    name: 'Framer Motion',
    category: 'frontend',
    description: 'Declarative physics-based animations, layout transitions, gestures, and scroll triggers.',
    color: '#FF0055',
    experienceLevel: 'Advanced',
    repoProof: 'InvestProp AI, Portfolio Studio',
  },
  {
    name: 'GSAP Animation',
    category: 'frontend',
    description: 'Professional-grade timeline animations, 3D camera transitions, and SVG motion.',
    color: '#88CE02',
    experienceLevel: 'Intermediate',
    repoProof: '3D Workstation Studio',
  },
  {
    name: 'Redux Toolkit & Zustand',
    category: 'frontend',
    description: 'Predictable client-side global state management, slices, and persistent stores.',
    color: '#764ABC',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD, FoodFlow',
  },
  {
    name: 'HTML5 & Semantic Web',
    category: 'frontend',
    description: 'Accessible semantic structures, SEO metadata, ARIA accessibility, and Web standards.',
    color: '#E34F26',
    experienceLevel: 'Expert',
    repoProof: 'All 10 repositories',
  },
  {
    name: 'Vite & Modern Bundlers',
    category: 'frontend',
    description: 'Instant Hot Module Replacement (HMR), optimized tree-shaking, and code-splitting.',
    color: '#646CFF',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD, TypeMarket, InvestProp AI',
  },

  // --- BACKEND & APIS (8 Skills) ---
  {
    name: 'Node.js',
    category: 'backend',
    description: 'Non-blocking I/O event-driven backend architectures, stream processing, and CLI tools.',
    color: '#339933',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD, FoodFlow, SkillForge, Pet Adoption, Job Finder',
  },
  {
    name: 'Express.js',
    category: 'backend',
    description: 'RESTful API routing, rate limiting, error middleware, CORS policies, and controllers.',
    color: '#ffffff',
    experienceLevel: 'Advanced',
    repoProof: 'All 7 full-stack & backend repositories',
  },
  {
    name: 'Socket.IO Real-Time',
    category: 'backend',
    description: 'Bi-directional WebSockets for live rider GPS tracking, chat, and instant notifications.',
    color: '#010101',
    experienceLevel: 'Advanced',
    repoProof: 'FoodFlow, StartupForge',
  },
  {
    name: 'WebRTC Video & Audio',
    category: 'backend',
    description: 'Peer-to-peer real-time mesh audio/video calling pipelines with STUN/TURN signaling.',
    color: '#339933',
    experienceLevel: 'Intermediate',
    repoProof: 'StartupForge',
  },
  {
    name: 'Upstash Redis Caching',
    category: 'backend',
    description: 'High-speed in-memory database caching, key-value stores, and API rate-limiting.',
    color: '#FF4438',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD Enterprise',
  },
  {
    name: 'Nodemailer & SMTP',
    category: 'backend',
    description: 'Automated email dispatching, transactional email templates, and OTP 2FA verification.',
    color: '#EA4335',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD, Pet Adoption Server',
  },
  {
    name: 'Multer & Cloudinary SDK',
    category: 'backend',
    description: 'Multipart file uploads, dynamic image transformation pipelines, and secure cloud storage.',
    color: '#3448C5',
    experienceLevel: 'Advanced',
    repoProof: 'Job Finder API, StartupForge',
  },
  {
    name: 'RESTful Architecture',
    category: 'backend',
    description: 'Standardized HTTP status codes, JSON API design, pagination, and request validation.',
    color: '#06B6D4',
    experienceLevel: 'Advanced',
    repoProof: 'Pet Adoption, Job Finder, Books Platform',
  },

  // --- DATABASE & AUTH (6 Skills) ---
  {
    name: 'MongoDB Atlas & Mongoose',
    category: 'database',
    description: 'Complex aggregation pipelines, multi-document indexing, schema modeling, and Atlas clusters.',
    color: '#47A248',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD, FoodFlow, SkillForge, Pet Adoption, Job Finder',
  },
  {
    name: 'PostgreSQL & Supabase',
    category: 'database',
    description: 'Relational database schemas, ACID transactions, foreign keys, and SQL queries.',
    color: '#4169E1',
    experienceLevel: 'Intermediate',
    repoProof: 'Enterprise systems & relational storage',
  },
  {
    name: 'JWT Authentication',
    category: 'database',
    description: 'Stateless JSON Web Tokens, HTTP-only secure cookies, and token refresh rotations.',
    color: '#D63AFF',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD, Pet Adoption, Job Finder',
  },
  {
    name: 'Better Auth & OAuth 2.0',
    category: 'database',
    description: 'Google OAuth integration, multi-session management, and CSRF token protections.',
    color: '#4285F4',
    experienceLevel: 'Advanced',
    repoProof: 'SkillForge',
  },
  {
    name: 'RBAC Access Control',
    category: 'database',
    description: 'Multi-portal Role-Based Access Control protecting Admin, Seller, Rider, and Customer.',
    color: '#7C3AED',
    experienceLevel: 'Expert',
    repoProof: 'ShopX BD Enterprise, FoodFlow',
  },
  {
    name: 'Firebase Authentication',
    category: 'database',
    description: 'Federated social logins, client-side auth state listeners, and secure tokens.',
    color: '#FFCA28',
    experienceLevel: 'Intermediate',
    repoProof: 'Early prototype portals & auth handlers',
  },

  // --- DEVOPS & CLOUD (7 Skills) ---
  {
    name: 'Docker & Docker Compose',
    category: 'devops',
    description: 'Containerizing multi-service web apps, Dockerfiles, volume binding, and local testing.',
    color: '#2496ED',
    experienceLevel: 'Intermediate',
    repoProof: 'SkillForge',
  },
  {
    name: 'Git & GitHub Workflows',
    category: 'devops',
    description: 'Git branch management, pull requests, semantic commit conventions, and repo governance.',
    color: '#F05032',
    experienceLevel: 'Expert',
    repoProof: 'All 10 GitHub repositories',
  },
  {
    name: 'GitHub Actions (CI/CD)',
    category: 'devops',
    description: 'Automated test pipelines, linting workflows, and continuous production deployment scripts.',
    color: '#2088FF',
    experienceLevel: 'Intermediate',
    repoProof: 'SkillForge, ShopX BD',
  },
  {
    name: 'Vercel Deployment',
    category: 'devops',
    description: 'Serverless edge functions, SPA rewrites, preview branches, and custom domain SSL.',
    color: '#ffffff',
    experienceLevel: 'Expert',
    repoProof: 'ShopX BD, FoodFlow, SkillForge, TypeMarket, Portfolio',
  },
  {
    name: 'Render Cloud Platform',
    category: 'devops',
    description: 'Deploying continuous Node/Express backend web services and managed environment secrets.',
    color: '#46E3B7',
    experienceLevel: 'Advanced',
    repoProof: 'FoodFlow Server, Pet Adoption Server',
  },
  {
    name: 'Postman API Testing',
    category: 'devops',
    description: 'Automated test suites, environment variables, mock servers, and API documentation.',
    color: '#FF6C37',
    experienceLevel: 'Advanced',
    repoProof: 'Pet Adoption Server, Job Finder API',
  },
  {
    name: 'Linux & Bash Scripting',
    category: 'devops',
    description: 'Unix shell commands, process management, SSH access, and server configuration.',
    color: '#FCC624',
    experienceLevel: 'Intermediate',
    repoProof: 'Server environments & Docker containers',
  },

  // --- AI & THIRD-PARTY SERVICES (4 Skills) ---
  {
    name: 'Google Gemini AI API',
    category: 'ai-services',
    description: 'Generative AI pipelines, contextual chatbot agents, ATS keyword scoring, and semantic search.',
    color: '#4285F4',
    experienceLevel: 'Advanced',
    repoProof: 'FoodFlow, SkillForge, Portfolio AI',
  },
  {
    name: 'Stripe Payment Gateway',
    category: 'ai-services',
    description: 'Stripe Checkout sessions, webhook listeners, idempotency keys, and subscription billing.',
    color: '#635BFF',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD, FoodFlow, StartupForge',
  },
  {
    name: 'SSLCommerz Gateway',
    category: 'ai-services',
    description: 'Local Bangladeshi mobile banking (bKash, Nagad, Rocket) IPN validation listeners.',
    color: '#00A65A',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD Enterprise',
  },
  {
    name: 'Leaflet GIS Maps',
    category: 'ai-services',
    description: 'Interactive map tiles, live rider GPS coordinates telemetry, and delivery geofencing.',
    color: '#199900',
    experienceLevel: 'Advanced',
    repoProof: 'ShopX BD, FoodFlow',
  },
];

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: allSkillsList.filter(s => s.category === 'frontend'),
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    skills: allSkillsList.filter(s => s.category === 'backend'),
  },
  {
    id: 'database',
    label: 'Database & Auth',
    skills: allSkillsList.filter(s => s.category === 'database'),
  },
  {
    id: 'devops',
    label: 'DevOps & Cloud',
    skills: allSkillsList.filter(s => s.category === 'devops'),
  },
  {
    id: 'ai-services',
    label: 'AI & Services',
    skills: allSkillsList.filter(s => s.category === 'ai-services'),
  },
];
