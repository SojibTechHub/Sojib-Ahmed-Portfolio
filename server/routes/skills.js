const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const defaultSkills = require('../data/skillsData');
const authMiddleware = require('../middleware/auth');

// Seed helper if DB is connected and empty
const ensureSeeded = async () => {
  try {
    const count = await Skill.countDocuments();
    if (count === 0) {
      await Skill.insertMany(defaultSkills);
      console.log('🌱 Skills seeded into MongoDB successfully');
    }
  } catch (err) {
    console.log('Skills seed check skipped:', err.message);
  }
};

// GET /api/skills (public)
router.get('/', async (req, res) => {
  try {
    await ensureSeeded();
    const { category } = req.query;
    const filter = category ? { category } : {};

    let data = await Skill.find(filter).sort({ order: 1, createdAt: 1 });
    if (!data || data.length === 0) {
      data = category ? defaultSkills.filter(s => s.category === category) : defaultSkills;
    }
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.json({ success: true, data: defaultSkills, total: defaultSkills.length });
  }
});

// GET /api/skills/:id
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.json({ success: true, data: skill });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/skills (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, category, description, color, experienceLevel, repoProof, order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const newSkill = await Skill.create({
      name,
      category: category || 'frontend',
      description: description || '',
      color: color || '#06B6D4',
      experienceLevel: experienceLevel || 'Advanced',
      repoProof: repoProof || '',
      order: order !== undefined ? Number(order) : 99,
    });

    res.status(201).json({ success: true, data: newSkill, message: 'Skill created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/skills/:id (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, category, description, color, experienceLevel, repoProof, order } = req.body;

    const updateData = {
      ...(name && { name }),
      ...(category && { category }),
      ...(description !== undefined && { description }),
      ...(color !== undefined && { color }),
      ...(experienceLevel !== undefined && { experienceLevel }),
      ...(repoProof !== undefined && { repoProof }),
      ...(order !== undefined && { order: Number(order) }),
    };

    const skill = await Skill.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({ success: true, data: skill, message: 'Skill updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/skills/:id (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

