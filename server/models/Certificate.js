const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  customId: { type: String, default: '' },
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issuerLogo: { type: String, default: '📜' },
  badgeText: { type: String, default: 'Verified Credential' },
  date: { type: String, default: '2026' },
  duration: { type: String, default: '' },
  skills: [{ type: String }],
  verifyUrl: { type: String, default: '' },
  downloadUrl: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  color: { type: String, default: '#06B6D4' },
  image: { type: String, default: '/certificates/certificate.png' },
  featured: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);

