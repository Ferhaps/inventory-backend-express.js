import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { ProductController } from '../controllers/products.controller';

export const productRoutes = Router();
const productController = new ProductController();

productRoutes.get('/', authMiddleware, productController.getProducts);
// productRoutes.post('/login', productController.login);
