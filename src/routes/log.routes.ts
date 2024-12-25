import { Router } from 'express';
import adminMiddleware from '../middleware/admin.middleware';
import { LogController } from '../controllers/log.controller';

/**
 * @swagger
 * /api/logs:
 *   post:
 *     tags:
 *       - Logs
 *     summary: Get logs with filters
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
 *               user:
 *                 type: string
 *                 description: User ID to filter logs
 *               event:
 *                 type: string
 *                 description: Event type to filter logs
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date for log search
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date for log search
 *     responses:
 *       200:
 *         description: List of logs
 *       400:
 *         description: Validation error
 *       404:
 *         description: No logs found
 *       500:
 *         description: Server error
 */

export const logRoutes = Router();
const logController = new LogController();

logRoutes.post('/', adminMiddleware, logController.getLogs);
logRoutes.get('/events', adminMiddleware, logController.getLogEvents);