import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      default: 'Not specified',
    },
    company: {
      type: String,
      trim: true,
      default: 'Not specified',
    },
    service: {
      type: String,
      trim: true,
      default: 'Web Development',
    },
    details: {
      type: String,
      required: [true, 'Project details are required'],
      trim: true,
      minlength: [10, 'Details must be at least 10 characters long'],
    },
    status: {
      type: String,
      enum: ['new', 'in_review', 'contacted', 'completed', 'archived'],
      default: 'new',
    },
    notes: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by status and date
inquirySchema.index({ createdAt: -1, status: 1 });

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
