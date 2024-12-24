import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/authRequest';
import { UserDto } from '../dto/user.dto';


const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization header missing or invalid" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const secretKey = process.env.JWT_SECRET
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded as UserDto;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

export default authMiddleware;