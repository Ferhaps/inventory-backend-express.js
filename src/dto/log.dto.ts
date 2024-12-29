import { z } from 'zod';
import { LogEvent } from '../types/log';

export const LogSearchDtoSchema = z.object({
  pageSize: z.number().min(1).max(100),
  user: z.string().optional(),
  category: z.string().optional(),
  product : z.string().optional(),
  event: z.nativeEnum(LogEvent).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

export type LogSearchDto = z.infer<typeof LogSearchDtoSchema>;

export type UserInfo = {
  id: string;
  email: string;
};

export type ProductInfo = {
  id: string;
  name: string;
};

export type CategoryInfo = {
  id: string;
  name: string;
};

export type LogResponseDto = {
  id: string;
  timestamp: Date;
  event: string;
  user: UserInfo;
  product?: ProductInfo;
  category?: CategoryInfo;
  details?: string;
};
