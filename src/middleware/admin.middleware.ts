import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: any;
}

const adminMiddleware = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization header missing or invalid" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const secretKey = process.env.JWT_SECRET
    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
    req.user = decoded;
    
    // Check if user has admin role
    if (decoded.role !== 'ADMIN') {
      res.status(403).json({ message: "Access forbidden. Admin role required." });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

export default adminMiddleware;
