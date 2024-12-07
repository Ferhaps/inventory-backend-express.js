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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
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
 *     responses:
 *       201:
 *         description: Category created successfully
 * 
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       403:
 *         description: Admin access required
 */

export const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get('/', authMiddleware, categoryController.getCategories);
categoryRoutes.post('/', authMiddleware, categoryController.createCategory);
categoryRoutes.delete('/:id', adminMiddleware, categoryController.deleteCategory);
