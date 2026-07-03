import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'CAPTURED', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

paymentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
