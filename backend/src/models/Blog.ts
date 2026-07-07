import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: 'General',
    },
    imageUrl: {
      type: String,
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'APPROVED'],
      default: 'DRAFT',
    },
    author: {
      type: String,
      default: 'Inchell Team',
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
