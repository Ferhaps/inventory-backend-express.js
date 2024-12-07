import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { ProductController } from '../controllers/products.controller';
import adminMiddleware from '../middleware/admin.middleware';

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 */

export const productRoutes = Router();
const productController = new ProductController();

productRoutes.get('/', authMiddleware, productController.getProducts);
productRoutes.post('/', authMiddleware, productController.createProduct);
productRoutes.patch('/:id', authMiddleware, productController.updateQuantity);
productRoutes.delete('/:id', adminMiddleware, productController.deleteProduct);
