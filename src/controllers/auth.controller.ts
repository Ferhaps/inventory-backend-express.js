import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { RegisterDtoSchema }  from '../dto/register.dto';
import { Request, Response } from 'express';
import { LoginDtoSchema } from '../dto/login.dto';
import { Log } from '../models/log.model';
import { LogEvent } from '../types/log';

export class AuthController {
  public async register(req: Request, res: Response) {
    try {
      const validation = RegisterDtoSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: 'Validation erros',
          erros: validation.error.errors.map((error) => error.message)
        });
      }

      const { email, password, role } = validation.data;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        email,
        password: hashedPassword,
        role
      });

      const userJson = {
        id: user._id,
        email: user.email,
        role: user.role
      };
      res.status(200).json(userJson);

      Log.create({
        event: LogEvent.USER_REGISTER,
        user: user,
      }).catch(err => console.error('Error creating register log:', err));
    } catch (error) {
      res.status(400).json({ message: 'Error creating user' });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const validation = LoginDtoSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: 'Validation erros',
          erros: validation.error.errors.map((error) => error.message)
        });
      }

      const { email, password } = validation.data;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '30d' }
      );

      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        },
        token
      });

      Log.create({
        event: LogEvent.USER_LOGIN,
        user: user._id,
      }).catch(err => console.error('Error creating login log:', err));
    } catch (error) {
      res.status(400).json({ message: 'Error logging in' });
    }
  }
}