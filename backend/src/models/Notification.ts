import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    type: {
      type: String,
      enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'],
      default: 'INFO',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for frontend id
notificationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
