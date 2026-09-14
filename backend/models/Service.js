import mongoose from 'mongoose';

const subServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    iconName: {
      type: String,
      default: 'Code',
    },
    gradient: {
      type: String,
      default: 'from-blue-600 to-indigo-600',
    },
    features: [{ type: String }],
    subServices: [subServiceSchema],
    popular: {
      type: Boolean,
      default: false,
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

export const Service = mongoose.model('Service', serviceSchema);
export default Service;
