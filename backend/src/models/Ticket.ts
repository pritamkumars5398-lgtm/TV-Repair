import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
    },
    serviceType: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: String,
    },
    preferredTime: {
      type: String,
    },
    issueDescription: {
      type: String,
    },
    tvBrand: {
      type: String,
    },
    tvSize: {
      type: String,
    },
    tvType: {
      type: String,
    },
    modelNumber: {
      type: String,
    },
    photos: {
      type: [String],
      default: [],
    },
    pickupOtp: {
      type: String,
    },
    deliveryOtp: {
      type: String,
    },
    address: {
      type: String,
    },
    area: {
      type: String,
    },
    city: {
      type: String,
    },
    pincode: {
      type: String,
    },
    isPickup: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'tv_received', // Maps to the statuses in admin frontend
    },
    paymentStatus: {
      type: String,
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technician',
    },
    technicianName: {
      type: String,
    },
    technicianPhone: {
      type: String,
    },
    technicianPhoto: {
      type: String,
    },
    scheduledAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
    estimateAmount: {
      type: Number,
    },
    estimateBreakdown: {
      type: String,
    },
    techAssessmentAmount: {
      type: Number,
    },
    techAssessmentBreakdown: {
      type: String,
    },
    adminEstimateAmount: {
      type: Number,
    },
    adminEstimateBreakdown: {
      type: String,
    },
    estimateStatus: {
      type: String,
      enum: ['pending', 'pending_admin_review', 'sent_to_customer', 'approved', 'rejected'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for frontend id
ticketSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
