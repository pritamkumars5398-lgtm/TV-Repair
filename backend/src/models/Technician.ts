import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    jobsCompleted: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for frontend id
technicianSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Technician = mongoose.model('Technician', technicianSchema);

export default Technician;
