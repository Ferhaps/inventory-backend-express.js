import { z } from 'zod';
import { LogEvent } from '../types/log';

export const LogSearchDtoSchema = z.object({
  pageSize: z.number().min(1).max(100),
  user: z.string().optional(),
  event: z.nativeEnum(LogEvent).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

export type LogSearchDto = z.infer<typeof LogSearchDtoSchema>;

export type LogResponseDto = {
  id: string;
  timestamp: Date;
  event: string;
  user: {
    id: string;
    email: string;
  };
  details: Record<string, any>;
};
