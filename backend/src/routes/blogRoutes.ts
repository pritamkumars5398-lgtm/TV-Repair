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
import { uploadToCloudinary } from '../utils/cloudinary';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.get('/', getPublicBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Admin routes
router.get('/admin', protectAdmin, getAdminBlogs);
router.post('/upload', protectAdmin, upload.single('image'), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  try {
    const imageUrl = await uploadToCloudinary(file.buffer, 'blogs');
    res.json({ imageUrl });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Failed to upload image to Cloudinary', error: error.message || error });
  }
});
router.post('/', protectAdmin, createBlog);
router.put('/:id', protectAdmin, updateBlog);
router.delete('/:id', protectAdmin, deleteBlog);

export default router;
