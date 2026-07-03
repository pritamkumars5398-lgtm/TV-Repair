import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    reorderLevel: {
      type: Number,
      required: true,
      default: 10,
    },
    unitPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for frontend id
inventoryItemSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtual for stock status
inventoryItemSchema.virtual('status').get(function () {
  if (this.quantity <= 0) return 'OUT_OF_STOCK';
  if (this.quantity <= this.reorderLevel) return 'LOW_STOCK';
  return 'IN_STOCK';
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem;
