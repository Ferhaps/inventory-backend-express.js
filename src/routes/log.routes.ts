import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { LogController } from "../controllers/log.controller";

export const logRoutes = Router();
const logController = new LogController();

logRoutes.post('/', authMiddleware, logController.getLogs);