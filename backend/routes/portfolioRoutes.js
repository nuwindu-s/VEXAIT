import express from 'express';
import { Project } from '../models/Project.js';
import { initialProjects } from '../data/initialData.js';

const router = express.Router();

/**
 * Helper to generate slug from name
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * @route   GET /api/portfolio (or /api/projects)
 * @desc    Get all portfolio projects
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    let projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

    // If database has no projects yet, auto-seed with initial data
    if (projects.length === 0 && (!category || category === 'all')) {
      try {
        await Project.insertMany(initialProjects);
        projects = await Project.find({}).sort({ order: 1 });
      } catch (seedErr) {
        console.warn('Auto-seeding projects notice:', seedErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving portfolio' });
  }
});

/**
 * @route   GET /api/portfolio/:idOrSlug
 * @desc    Get single project by ID or Slug
 * @access  Public
 */
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let project = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(idOrSlug);
    }
    if (!project) {
      project = await Project.findOne({ slug: idOrSlug });
    }

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * @route   POST /api/portfolio
 * @desc    Create a new project
 * @access  Admin
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      slug,
      category = 'Web',
      tag,
      badge,
      subtitle,
      shortDesc,
      fullDesc,
      client,
      timeline,
      impact,
      technologies = [],
      deliverables = [],
      features = [],
      galleryImages = [],
      accentColor = 'from-blue-600 via-indigo-600 to-sky-600',
      mockupType = 'browser',
      url = '',
      isFeatured = true,
      order = 0,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Project name is required' });
    }

    if (!shortDesc || !shortDesc.trim()) {
      return res.status(400).json({ success: false, error: 'Short description is required' });
    }

    // Generate unique slug
    let finalSlug = slug ? slugify(slug) : slugify(name);
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = `project-${Date.now()}`;
    }
    let existing = await Project.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newProject = await Project.create({
      name: name.trim(),
      slug: finalSlug,
      category,
      tag: tag || category,
      badge: badge || '',
      subtitle: subtitle || '',
      shortDesc: shortDesc.trim(),
      fullDesc: fullDesc ? fullDesc.trim() : shortDesc.trim(),
      client: client || 'Private Client',
      timeline: timeline || 'Completed',
      impact: impact || '',
      technologies: Array.isArray(technologies) ? technologies : String(technologies).split(',').map((t) => t.trim()).filter(Boolean),
      deliverables: Array.isArray(deliverables) ? deliverables : String(deliverables).split('\n').map((d) => d.trim()).filter(Boolean),
      features: Array.isArray(features) ? features : String(features).split('\n').map((f) => f.trim()).filter(Boolean),
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      accentColor,
      mockupType,
      url,
      isFeatured: Boolean(isFeatured),
      order: Number(order) || 0,
    });

    console.log(`✨ New Project Created: ${newProject.name} (${newProject.slug})`);

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error creating project' });
  }
});

/**
 * @route   PUT /api/portfolio/:id
 * @desc    Update an existing project
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Normalize array fields if passed as strings or arrays
    if (body.technologies && !Array.isArray(body.technologies)) {
      body.technologies = String(body.technologies).split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (body.deliverables && !Array.isArray(body.deliverables)) {
      body.deliverables = String(body.deliverables).split('\n').map((d) => d.trim()).filter(Boolean);
    }
    if (body.features && !Array.isArray(body.features)) {
      body.features = String(body.features).split('\n').map((f) => f.trim()).filter(Boolean);
    }

    let updated = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    }
    if (!updated) {
      updated = await Project.findOneAndUpdate({ slug: id }, body, { new: true, runValidators: true });
    }

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error updating project' });
  }
});

/**
 * @route   DELETE /api/portfolio/:id
 * @desc    Delete a project
 * @access  Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Project.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Project.findOneAndDelete({ slug: id });
    }

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Project '${deleted.name}' deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ success: false, error: 'Server error deleting project' });
  }
});

/**
 * @route   POST /api/portfolio/seed
 * @desc    Seed or reset portfolio database with defaults
 * @access  Admin
 */
router.post('/seed', async (req, res) => {
  try {
    await Project.deleteMany({});
    const inserted = await Project.insertMany(initialProjects);
    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} portfolio projects.`,
      data: inserted,
    });
  } catch (error) {
    console.error('Portfolio seed error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
