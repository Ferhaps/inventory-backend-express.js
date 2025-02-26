import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import adminMiddleware from '../middleware/admin.middleware';
import { CategoryController } from '../controllers/category.controller';

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     description: Retrieve all product categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                   name:
 *                     type: string
 *                     example: "Electronics"
 *       400:
 *         description: Error fetching categories
 *       401:
 *         description: Unauthorized access
 *   
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
 *     description: Create a new product category
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
 *                 example: "Electronics"
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *                 name:
 *                   type: string
 *                   example: "Electronics"
 *       400:
 *         description: Error creating category
 *       401:
 *         description: Unauthorized access
 * 
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a category
 *     description: Delete a product category (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       400:
 *         description: Error deleting category
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 */

export const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get('/', authMiddleware, categoryController.getCategories);
categoryRoutes.post('/', authMiddleware, categoryController.createCategory);
categoryRoutes.delete('/:id', adminMiddleware, categoryController.deleteCategory);
