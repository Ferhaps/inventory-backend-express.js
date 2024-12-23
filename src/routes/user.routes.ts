import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { UsersController } from "../controllers/users.controller";

export const userRoutes = Router();
const usersController = new UsersController();

userRoutes.get('/', authMiddleware, usersController.getUsers);
