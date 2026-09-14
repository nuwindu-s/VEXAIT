import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: 'website_footer',
    },
  },
  {
    timestamps: true,
  }
);

export const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export default Newsletter;
