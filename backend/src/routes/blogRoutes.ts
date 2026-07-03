import express from 'express';
import { 
  getAdminBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog, 
  getPublicBlogs, 
  getBlogBySlug 
} from '../controllers/blogController';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getPublicBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Admin routes
router.get('/admin', protectAdmin, getAdminBlogs);
router.post('/', protectAdmin, createBlog);
router.put('/:id', protectAdmin, updateBlog);
router.delete('/:id', protectAdmin, deleteBlog);

export default router;
