const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const defaultCertificates = require('../data/certificatesData');
const authMiddleware = require('../middleware/auth');

// Seed helper if DB is connected and empty
const ensureSeeded = async () => {
  try {
    const count = await Certificate.countDocuments();
    if (count === 0) {
      const seeded = defaultCertificates.map((c, index) => ({
        customId: c.id,
        title: c.title,
        issuer: c.issuer,
        issuerLogo: c.issuerLogo || '📜',
        badgeText: c.badgeText,
        date: c.date,
        duration: c.duration,
        skills: c.skills || [],
        verifyUrl: c.verifyUrl,
        downloadUrl: c.downloadUrl || c.verifyUrl,
        credentialId: c.credentialId,
        color: c.color || '#06B6D4',
        image: c.image || '/certificates/certificate.png',
        featured: c.featured ?? true,
        order: index + 1,
      }));
      await Certificate.insertMany(seeded);
      console.log('🌱 Certificates seeded into MongoDB successfully');
    }
  } catch (err) {
    console.log('Certificates seed check skipped:', err.message);
  }
};

// GET /api/certificates (public)
router.get('/', async (req, res) => {
  try {
    await ensureSeeded();
    let data = await Certificate.find().sort({ order: 1, createdAt: 1 });
    if (!data || data.length === 0) {
      data = defaultCertificates;
    }
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.json({ success: true, data: defaultCertificates, total: defaultCertificates.length });
  }
});

// GET /api/certificates/:id
router.get('/:id', async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      const fallback = defaultCertificates.find(c => c.id === req.params.id);
      if (!fallback) return res.status(404).json({ success: false, message: 'Certificate not found' });
      return res.json({ success: true, data: fallback });
    }
    res.json({ success: true, data: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/certificates (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      issuer,
      issuerLogo,
      badgeText,
      date,
      duration,
      skills,
      verifyUrl,
      downloadUrl,
      credentialId,
      color,
      image,
      featured,
      order,
    } = req.body;

    if (!title || !issuer) {
      return res.status(400).json({ success: false, message: 'Title and issuer are required' });
    }

    const newCert = await Certificate.create({
      customId: req.body.id || `cert-${Date.now()}`,
      title,
      issuer,
      issuerLogo: issuerLogo || '📜',
      badgeText: badgeText || 'Verified Credential',
      date: date || '2026',
      duration: duration || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      verifyUrl: verifyUrl || '',
      downloadUrl: downloadUrl || verifyUrl || '',
      credentialId: credentialId || '',
      color: color || '#06B6D4',
      image: image || '/certificates/certificate.png',
      featured: featured !== undefined ? !!featured : true,
      order: order !== undefined ? Number(order) : 99,
    });

    res.status(201).json({ success: true, data: newCert, message: 'Certificate added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/certificates/:id (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      issuer,
      issuerLogo,
      badgeText,
      date,
      duration,
      skills,
      verifyUrl,
      downloadUrl,
      credentialId,
      color,
      image,
      featured,
      order,
    } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(issuer && { issuer }),
      ...(issuerLogo !== undefined && { issuerLogo }),
      ...(badgeText !== undefined && { badgeText }),
      ...(date !== undefined && { date }),
      ...(duration !== undefined && { duration }),
      ...(skills !== undefined && {
        skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      }),
      ...(verifyUrl !== undefined && { verifyUrl }),
      ...(downloadUrl !== undefined && { downloadUrl }),
      ...(credentialId !== undefined && { credentialId }),
      ...(color !== undefined && { color }),
      ...(image !== undefined && { image }),
      ...(featured !== undefined && { featured: !!featured }),
      ...(order !== undefined && { order: Number(order) }),
    };

    let cert = null;
    try {
      cert = await Certificate.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    } catch {
      cert = await Certificate.findOneAndUpdate({ customId: req.params.id }, updateData, { new: true });
    }

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.json({ success: true, data: cert, message: 'Certificate updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/certificates/:id (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let cert = null;
    try {
      cert = await Certificate.findByIdAndDelete(req.params.id);
    } catch {
      cert = await Certificate.findOneAndDelete({ customId: req.params.id });
    }

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
