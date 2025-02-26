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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   categoryId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Error fetching products
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Product name
 *       - in: query
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Error creating product
 * 
 * /api/products/{id}:
 *   patch:
 *     tags:
 *       - Products
 *     summary: Update product quantity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: query
 *         name: quantity
 *         required: true
 *         schema:
 *           type: number
 *         description: New quantity value
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *       400:
 *         description: Error updating product quantity
 *       404:
 *         description: Product not found
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Error deleting product
 */

export const productRoutes = Router();
const productController = new ProductController();

productRoutes.get('/', authMiddleware, productController.getProducts);
productRoutes.post('/', authMiddleware, productController.createProduct);
productRoutes.patch('/:id', authMiddleware, productController.updateQuantity);
productRoutes.delete('/:id', adminMiddleware, productController.deleteProduct);
