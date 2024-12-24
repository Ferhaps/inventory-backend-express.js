import { Request } from 'express';
import { UserDto } from '../dto/user.dto';

export interface AuthRequest extends Request {
  user?: UserDto;
}