import express from 'express';
import { authAdmin, registerAdmin } from '../controllers/authController';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/admin/login', authAdmin);

// We can protect the register route so only existing admins can create new admins
// Or we can leave it open initially to create the very first admin
router.post('/admin/register', registerAdmin);

export default router;
