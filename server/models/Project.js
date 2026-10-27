const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  problem: { type: String, default: '' },
  solution: { type: String, default: '' },
  role: { type: String, default: 'Full-Stack Developer' },
  category: { 
    type: String, 
    enum: ['all', 'full-stack', 'frontend', 'backend', 'ai'], 
    default: 'full-stack' 
  },
  year: { type: String, default: '2026' },
  featured: { type: Boolean, default: false },
  techStack: [{ type: String }],
  features: [{ type: String }],
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  docsUrl: { type: String, default: '' },
  color: { type: String, default: '#06B6D4' },
  accentColor: { type: String, default: '#7C3AED' },
  image: { type: String, default: '/images/hero.jpg' },
  credentials: {
    user: { type: String, default: '' },
    admin: { type: String, default: '' },
  },
  order: { type: Number, default: 0 },
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Project', projectSchema);
