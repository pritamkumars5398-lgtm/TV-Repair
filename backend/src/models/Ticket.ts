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
    scheduledAt: {
      type: Date,
    },
    notes: {
      type: String,
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
