import express from 'express';
import { Inquiry } from '../models/Inquiry.js';

const router = express.Router();

/**
 * @route   POST /api/inquiries (or /api/contact)
 * @desc    Submit a new contact / project inquiry
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, service, details } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    }

    if (!details || details.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least 10 characters describing your project or inquiry',
      });
    }

    // Capture IP and User Agent
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const newInquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || 'Not specified',
      company: company?.trim() || 'Not specified',
      service: service || 'Web Development',
      details: details.trim(),
      ipAddress: String(ipAddress),
      userAgent: String(userAgent),
    });

    console.log(`📩 New Inquiry Received from ${newInquiry.name} (${newInquiry.email}) for service: ${newInquiry.service}`);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been received. Our team will contact you shortly.',
      data: {
        id: newInquiry._id,
        name: newInquiry.name,
        service: newInquiry.service,
        createdAt: newInquiry.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while processing your inquiry. Please try again later.',
    });
  }
});

/**
 * @route   GET /api/inquiries
 * @desc    Get all inquiries (with optional status filtering)
 * @access  Public (or Admin protected)
 */
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Inquiry.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: inquiries,
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return res.status(500).json({ success: false, error: 'Server error fetching inquiries' });
  }
});

/**
 * @route   GET /api/inquiries/:id
 * @desc    Get single inquiry details
 * @access  Public / Admin
 */
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    return res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * @route   PATCH /api/inquiries/:id
 * @desc    Update inquiry status or admin notes
 * @access  Public / Admin
 */
router.patch('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await Inquiry.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/inquiries/:id
 * @desc    Delete inquiry
 * @access  Public / Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    return res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
