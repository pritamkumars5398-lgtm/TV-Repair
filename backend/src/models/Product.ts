import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
    },
    specs: {
      type: [String],
      default: [],
    },
    price: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
