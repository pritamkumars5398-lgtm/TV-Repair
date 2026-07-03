import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { protectAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protectAdmin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protectAdmin, updateProduct)
  .delete(protectAdmin, deleteProduct);

export default router;
