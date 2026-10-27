const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const defaultProjects = require('../data/projectsData');
const authMiddleware = require('../middleware/auth');

// Seed helper if DB is connected and empty
const ensureSeeded = async () => {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      const seeded = defaultProjects.map((p, index) => ({
        title: p.title,
        subtitle: p.subtitle,
        description: p.description || p.subtitle,
        category: p.category || 'full-stack',
        year: p.year || '2026',
        featured: !!p.featured,
        techStack: p.techStack || [],
        liveUrl: p.liveUrl || '',
        githubUrl: p.githubUrl || '',
        image: p.image || '/images/hero.jpg',
        order: index,
      }));
      await Project.insertMany(seeded);
      console.log('🌱 Projects seeded into MongoDB successfully');
    }
  } catch (err) {
    console.log('Project seed check skipped:', err.message);
  }
};

// GET /api/projects (public)
router.get('/', async (req, res) => {
  try {
    await ensureSeeded();
    const { category, featured } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.featured = true;

    let data = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    if (!data || data.length === 0) {
      data = defaultProjects;
    }
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.json({ success: true, data: defaultProjects, total: defaultProjects.length });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const fallback = defaultProjects.find(p => p.id === req.params.id);
      if (!fallback) return res.status(404).json({ success: false, message: 'Project not found' });
      return res.json({ success: true, data: fallback });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, description, category, year, featured, techStack, liveUrl, githubUrl, image } = req.body;
    if (!title || !subtitle) {
      return res.status(400).json({ success: false, message: 'Title and subtitle are required' });
    }

    const newProject = await Project.create({
      title,
      subtitle,
      description: description || subtitle,
      category: category || 'full-stack',
      year: year || new Date().getFullYear().toString(),
      featured: !!featured,
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()) : []),
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      image: image || '/images/hero.jpg',
    });

    res.status(201).json({ success: true, data: newProject, message: 'Project created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:id (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, subtitle, description, category, year, featured, techStack, liveUrl, githubUrl, image } = req.body;
    
    const updateData = {
      ...(title && { title }),
      ...(subtitle && { subtitle }),
      ...(description !== undefined && { description }),
      ...(category && { category }),
      ...(year && { year }),
      ...(featured !== undefined && { featured }),
      ...(techStack && { 
        techStack: Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()) 
      }),
      ...(liveUrl !== undefined && { liveUrl }),
      ...(githubUrl !== undefined && { githubUrl }),
      ...(image && { image }),
    };

    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Project not found' });

    res.json({ success: true, data: updated, message: 'Project updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:id (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
