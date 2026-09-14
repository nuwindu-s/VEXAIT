import express from 'express';
import { Service } from '../models/Service.js';
import { initialServices } from '../data/initialData.js';

const router = express.Router();

/**
 * @route   GET /api/services
 * @desc    Get all services
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    let services = await Service.find({}).sort({ order: 1 });

    // Auto-seed if empty
    if (services.length === 0) {
      try {
        await Service.insertMany(initialServices);
        services = await Service.find({}).sort({ order: 1 });
      } catch (seedErr) {
        console.warn('Auto-seeding services notice:', seedErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Service fetch error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving services' });
  }
});

/**
 * @route   POST /api/services/seed
 * @desc    Seed services catalog into MongoDB
 * @access  Admin
 */
router.post('/seed', async (req, res) => {
  try {
    await Service.deleteMany({});
    const inserted = await Service.insertMany(initialServices);
    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} services.`,
      data: inserted,
    });
  } catch (error) {
    console.error('Service seed error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
