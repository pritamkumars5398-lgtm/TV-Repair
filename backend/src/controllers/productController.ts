import { Request, Response } from 'express';
import Product from '../models/Product';

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, desc, specs, price, img } = req.body;

    const product = new Product({
      name,
      category,
      desc,
      specs,
      price,
      img,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, desc, specs, price, img, isApproved } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (product) {
      product.name = name || product.name;
      product.category = category || product.category;
      product.desc = desc || product.desc;
      product.specs = specs || product.specs;
      product.price = price || product.price;
      product.img = img || product.img;
      if (isApproved !== undefined) {
        product.isApproved = isApproved;
      }
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
