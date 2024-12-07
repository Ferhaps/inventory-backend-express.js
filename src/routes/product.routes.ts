import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { ProductController } from '../controllers/products.controller';
import adminMiddleware from '../middleware/admin.middleware';

export const productRoutes = Router();
const productController = new ProductController();

productRoutes.get('/', authMiddleware, productController.getProducts);
productRoutes.post('/', authMiddleware, productController.createProduct);
productRoutes.patch('/:id', authMiddleware, productController.updateQuantity);
productRoutes.delete('/:id', adminMiddleware, productController.deleteProduct);
