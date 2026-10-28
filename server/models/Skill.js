const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['frontend', 'backend', 'database', 'devops', 'ai-services'], 
    default: 'frontend' 
  },
  description: { type: String, default: '' },
  color: { type: String, default: '#06B6D4' },
  experienceLevel: { type: String, default: 'Advanced' },
  repoProof: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
