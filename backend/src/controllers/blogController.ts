import { Request, Response } from 'express';
import Blog from '../models/Blog';

// @desc    Get all blogs (Admin)
// @route   GET /api/v1/blogs/admin
// @access  Private/Admin
export const getAdminBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const items = await Blog.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Blog.countDocuments();

    res.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a blog
// @route   POST /api/v1/blogs
// @access  Private/Admin
export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, content, category, imageUrl, readTime, featured, status, author } = req.body;
    
    // Auto-generate slug if not provided
    const blogSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const blogExists = await Blog.findOne({ slug: blogSlug });
    if (blogExists) {
      res.status(400).json({ message: 'A blog with this slug already exists' });
      return;
    }

    const blog = await Blog.create({
      title,
      slug: blogSlug,
      content,
      category,
      imageUrl,
      readTime,
      featured,
      status,
      author,
    });

    res.status(201).json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a blog
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (blog) {
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get public approved blogs
// @route   GET /api/v1/blogs
// @access  Public
export const getPublicBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({ status: 'APPROVED' }).sort({ createdAt: 1 });
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/v1/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'APPROVED' });
    
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
