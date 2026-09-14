import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String, default: '' },
    caption: { type: String, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Web', 'Software', 'Mobile', 'E-Commerce', 'Other'],
      default: 'Web',
    },
    tag: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    shortDesc: {
      type: String,
      required: true,
    },
    fullDesc: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      default: '',
    },
    timeline: {
      type: String,
      default: '',
    },
    impact: {
      type: String,
      default: '',
    },
    technologies: [{ type: String }],
    deliverables: [{ type: String }],
    accentColor: {
      type: String,
      default: 'from-blue-600 via-indigo-600 to-sky-600',
    },
    mockupType: {
      type: String,
      enum: ['browser', 'mobile', 'dashboard'],
      default: 'browser',
    },
    url: {
      type: String,
      default: '',
    },
    features: [{ type: String }],
    galleryImages: [galleryImageSchema],
    isFeatured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model('Project', projectSchema);
export default Project;
