import express from 'express';
import multer from 'multer';
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
const upload = multer({ dest: 'uploads/' });

// Public routes
router.get('/', getPublicBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Admin routes
router.get('/admin', protectAdmin, getAdminBlogs);
router.post('/upload', protectAdmin, upload.single('image'), (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  res.json({ imageUrl });
});
router.post('/', protectAdmin, createBlog);
router.put('/:id', protectAdmin, updateBlog);
router.delete('/:id', protectAdmin, deleteBlog);

export default router;
