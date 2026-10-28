const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  availableForHire: { type: Boolean, default: true },
  availabilityText: { type: String, default: 'Available for New Opportunities' },
  statusBadge: { type: String, default: 'Building something awesome... 🚀' },
  bio: { 
    type: String, 
    default: 'Passionate Full Stack Developer dedicated to building scalable, high-performance web applications with futuristic design aesthetics.' 
  },
  email: { type: String, default: 'sojibahmedshorif998@gmail.com' },
  phone: { type: String, default: '+880 1942791004' },
  whatsapp: { type: String, default: '+880 1942791004' },
  github: { type: String, default: 'SojibTechHub' },
  linkedin: { type: String, default: 'sojib-ahmed-shorif' },
  facebook: { type: String, default: 'https://www.facebook.com/share/16G2SwmtSFk/' },
  yearsExperience: { type: String, default: '2+' },
  projectsCompleted: { type: String, default: '15+' },
  clientSatisfaction: { type: String, default: '100%' },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
