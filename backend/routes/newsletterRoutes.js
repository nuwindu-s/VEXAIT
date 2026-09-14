import express from 'express';
import { Newsletter } from '../models/Newsletter.js';

const router = express.Router();

/**
 * @route   POST /api/newsletter
 * @desc    Subscribe to newsletter
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: normalizedEmail });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to the VEXA IT newsletter!',
      });
    }

    const newSubscriber = await Newsletter.create({
      email: normalizedEmail,
    });

    console.log(`📬 New Newsletter Subscriber: ${newSubscriber.email}`);

    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed to updates from VEXA IT.',
      data: { email: newSubscriber.email },
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return res.status(500).json({ success: false, error: 'Server error processing subscription' });
  }
});

/**
 * @route   GET /api/newsletter
 * @desc    Get all subscribers
 * @access  Public / Admin
 */
router.get('/', async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
