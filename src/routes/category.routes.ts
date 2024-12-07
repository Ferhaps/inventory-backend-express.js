import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import adminMiddleware from '../middleware/admin.middleware';
import { CategoryController } from '../controllers/category.controller';

export const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get('/', authMiddleware, categoryController.getCategories);
categoryRoutes.post('/', authMiddleware, categoryController.createCategory);
categoryRoutes.delete('/:id', adminMiddleware, categoryController.deleteCategory);
