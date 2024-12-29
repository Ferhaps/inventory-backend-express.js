import { ILog, Log } from '../models/log.model';
import { LogResponseDto, LogSearchDtoSchema } from '../dto/log.dto';
import { Request, Response } from 'express';
import { RootFilterQuery, Types } from 'mongoose';

type PopulatedUser = {
  _id: Types.ObjectId;
  email: string;
};

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

      const { pageSize, user, event, startDate, endDate, product, category } = validation.data;

      const query: RootFilterQuery<ILog> = {};
      if (user) query.user = new Types.ObjectId(user);
      if (event) query.event = event;
      if (product) query['product.id'] = new Types.ObjectId(product);
      if (category) query['category.id'] = new Types.ObjectId(category);
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      const logs = await Log.find(query)
        .sort({ timestamp: -1 })
        .limit(pageSize)
        .populate<{ user: PopulatedUser }>('user', 'email')
        .lean()
        .exec();

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

        if (log.product) {
          baseLog.product = {
            id: log.product.id.toString(),
            name: log.product.name
          };
        }

        if (log.category) {
          baseLog.category = {
            id: log.category.id.toString(),
            name: log.category.name
          };
        }

        if (log.details) {
          baseLog.details = log.details;
        }

        return baseLog;
      });
      
      res.json(logsRes);
    } catch (error) {
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
      res.status(500).json({
        message: 'Error while fetching log events',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
