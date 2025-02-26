import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { UsersController } from "../controllers/users.controller";
import adminMiddleware from "../middleware/admin.middleware";

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       400:
 *         description: Error fetching users
 * 
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Error deleting user
 */

export const userRoutes = Router();
const usersController = new UsersController();

userRoutes.get('/', authMiddleware, usersController.getUsers);
userRoutes.delete('/:id', adminMiddleware, usersController.deleteUser);
