import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define SiteSettings Mongoose Schema
const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'global_settings', unique: true },
    companyName: { type: String, default: 'VEXA IT' },
    tagline: { type: String, default: 'Innovate. Build. Grow.' },
    heroHeadline: {
      type: String,
      default: 'Technology & Digital Growth That Moves Your Business Forward.',
    },
    heroSubtext: {
      type: String,
      default:
        'Vexa IT builds modern websites, custom software, digital growth strategies, and social media solutions designed to scale your business.',
    },
    announcementBanner: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default: '⚡ Available for new web, software, and digital growth projects!',
      },
      linkText: { type: String, default: 'Book Consultation' },
      linkTab: { type: String, default: 'contact' },
    },
    phone: { type: String, default: '+94 71 269 6668' },
    email: { type: String, default: 'vexa.it2026@gmail.com' },
    location: { type: String, default: 'Colombo, Sri Lanka' },
    businessHours: {
      type: String,
      default: 'Monday – Friday: 9:00 AM – 6:00 PM (GMT+5:30)',
    },
    whatsappUrl: {
      type: String,
      default:
        "https://wa.me/94712696668?text=Hello%20Vexa%20IT,%20I'd%20like%20to%20discuss%20a%20project.",
    },
    socials: {
      facebook: {
        type: String,
        default: 'https://www.facebook.com/share/19L1ATA1vk/?mibextid=wwXIfr',
      },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    stats: [
      {
        id: { type: String },
        value: { type: String },
        label: { type: String },
        sublabel: { type: String },
        highlight: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);

const defaultStats = [
  {
    id: 'projects',
    value: '50+',
    label: 'Projects Completed',
    sublabel: 'Delivered on schedule & within scope',
    highlight: 'across diverse industries',
  },
  {
    id: 'clients',
    value: '20+',
    label: 'Trusted Clients',
    sublabel: 'Startups, SMEs & enterprises',
    highlight: 'with 98% retention rate',
  },
  {
    id: 'services',
    value: '6+',
    label: 'Core Service Verticals',
    sublabel: 'Full-cycle digital engineering & growth',
    highlight: 'from discovery to scaling',
  },
  {
    id: 'support',
    value: '24/7',
    label: 'Dedicated Support',
    sublabel: 'Proactive monitoring & response',
    highlight: 'guaranteed SLA performance',
  },
];

/**
 * @route   GET /api/settings
 * @desc    Get website settings
 */
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await SiteSettings.create({
        key: 'global_settings',
        stats: defaultStats,
      });
    }
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving settings' });
  }
});

/**
 * @route   PUT /api/settings
 * @desc    Update website settings
 */
router.put('/', async (req, res) => {
  try {
    const updated = await SiteSettings.findOneAndUpdate(
      { key: 'global_settings' },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Website settings updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to update settings' });
  }
});

/**
 * @route   POST /api/settings/reset
 * @desc    Reset website settings to defaults
 */
router.post('/reset', async (req, res) => {
  try {
    await SiteSettings.deleteMany({ key: 'global_settings' });
    const resetSettings = await SiteSettings.create({
      key: 'global_settings',
      stats: defaultStats,
    });
    return res.status(200).json({
      success: true,
      message: 'Website settings reset to defaults',
      data: resetSettings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
