import { Router } from 'express';
import adminMiddleware from '../middleware/admin.middleware';
import { LogController } from '../controllers/log.controller';
import authMiddleware from '../middleware/auth.middleware';

/**
 * @swagger
 * /api/logs:
 *   post:
 *     tags:
 *       - Logs
 *     summary: Get logs with filters
 *     description: Retrieve logs with various filtering options
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageSize:
 *                 type: number
 *                 description: Number of logs to return
 *                 example: 10
 *               user:
 *                 type: string
 *                 description: User ID to filter logs
 *                 example: "60d21b4667d0d8992e610c85"
 *               event:
 *                 type: string
 *                 description: Event type to filter logs
 *                 example: "PRODUCT_CREATE"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date for log search
 *                 example: "2023-01-01T00:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date for log search
 *                 example: "2023-12-31T23:59:59.999Z"
 *     responses:
 *       200:
 *         description: List of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   event:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                   product:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   details:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Validation error
 *       404:
 *         description: No logs found
 *       500:
 *         description: Server error
 * 
 * /api/logs/events:
 *   get:
 *     tags:
 *       - Logs
 *     summary: Get all log event types
 *     description: Retrieve a list of all possible log event types
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of log event types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "PRODUCT_CREATE"
 *       400:
 *         description: Error fetching log events
 */

export const logRoutes = Router();
const logController = new LogController();

logRoutes.post('/', authMiddleware, logController.getLogs);
logRoutes.get('/events', authMiddleware, logController.getLogEvents);