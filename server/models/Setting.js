const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  name: { type: String, default: 'Sojib Ahmed' },
  title: { type: String, default: 'Full Stack Developer' },
  heroSubtitle: { type: String, default: 'Interactive 3D Workstation Studio' },
  availableForHire: { type: Boolean, default: true },
  availabilityText: { type: String, default: 'Available for Hire' },
  statusBadge: { type: String, default: 'Open for Full-Time & Contract Roles' },
  bio: { 
    type: String, 
    default: 'Full Stack Developer with expertise in React 19, Next.js 15, Node.js, Express, and MongoDB. Passionate about engineering high-concurrency microservices, AI pipelines, and intuitive UI/UX.' 
  },
  email: { type: String, default: 'sojibahmedshorif998@gmail.com' },
  phone: { type: String, default: '+880 1942791004' },
  whatsapp: { type: String, default: '+880 1942791004' },
  github: { type: String, default: 'https://github.com/SojibTechHub' },
  linkedin: { type: String, default: 'https://www.linkedin.com/in/sojib-ahmed-shorif' },
  facebook: { type: String, default: 'https://www.facebook.com/share/16G2SwmtSFk/' },
  resumeUrl: { type: String, default: 'https://drive.google.com/file/d/10ONRQsFH14NB1RvG7aJIltzSm6YGXqcy/view?usp=sharing' },
  yearsExperience: { type: String, default: '2+' },
  projectsCompleted: { type: String, default: '10+' },
  clientSatisfaction: { type: String, default: '100%' },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
