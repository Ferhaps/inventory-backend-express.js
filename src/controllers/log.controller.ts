import { Log } from '../models/log.model';
import { LogResponseDto, LogSearchDtoSchema } from '../dto/log.dto';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

interface PopulatedUser {
  _id: Types.ObjectId;
  email: string;
}

interface PopulatedProduct {
  _id: Types.ObjectId;
  name: string;
}

interface PopulatedCategory {
  _id: Types.ObjectId;
  name: string;
}

export class LogController {
  public async getLogs(req: Request, res: Response) {
    try {
      console.log(req.body)
      const validation = LogSearchDtoSchema.safeParse(req.body);
      console.log(validation.data)
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
        .populate<{ user: PopulatedUser }>('user', 'email')
        .populate<{ product: PopulatedProduct }>('product', 'name')
        .populate<{ category: PopulatedCategory }>('category', 'name');

      if (!logs.length) {
        res.status(404).json({ message: 'No logs found' });
      }

      const logsRes: LogResponseDto[] = logs.map(log => {
        const baseLog: LogResponseDto = {
          id: log._id.toString(),
          timestamp: log.timestamp,
          event: log.event,
          user: {
            id: log.user._id.toString(),
            email: log.user.email
          }
        };

        // Add product info if exists
        if (log.product) {
          baseLog.product = {
            id: log.product._id.toString(),
            name: log.product.name
          };
        }

        // Add category info if exists
        if (log.category) {
          baseLog.category = {
            id: log.category._id.toString(),
            name: log.category.name
          };
        }

        return baseLog;
      });
      
      res.json(logsRes);
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ 
        message: 'Error while fetching logs',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  public async getLogEvents(req: Request, res: Response) {
    try {
      const events = await Log.distinct('event');
      res.json(events);
    } catch (error) {
      console.error('Error fetching log events:', error);
      res.status(500).json({
        message: 'Error while fetching log events',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
