import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    source: {
      type: String,
      default: 'WEBSITE',
    },
    serviceType: {
      type: String,
    },
    status: {
      type: String,
      default: 'NEW',
    },
    message: {
      type: String,
    },
    productInterest: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for frontend id
leadSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
