import { Log } from '../models/log.model';
import { LogResponseDto, LogSearchDtoSchema } from '../dto/log.dto';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

interface PopulatedUser {
  _id: Types.ObjectId;
  email: string;
}

export class LogController {
  public async getLogs(req: Request, res: Response) {
    try {
      const validation = LogSearchDtoSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: 'Validation errors',
          errors: validation.error.errors
        });
      }

      const { pageSize, user, event, startDate, endDate } = validation.data;

      const query: any = {};
      if (user) query.user = user;
      if (event) query.event = event;
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      const logs = await Log.find(query)
        .sort({ timestamp: -1 })
        .limit(pageSize)
        .populate<{ user: PopulatedUser }>('user', 'email');

      if (!logs) {
        res.status(404).json({ message: 'No logs found' });
      }

      res.json(logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ 
        message: 'Internal server error while fetching logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
