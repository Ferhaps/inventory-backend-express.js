import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { RegisterDto, RegisterDtoSchema, RegisterResponse } from '../dto/register.dto';
import { HttpError } from '../types/error';
import { LoginDto, LoginDtoSchema, LoginResponse } from '../dto/login.dto';

export class AuthController {
  public register: RequestHandler<{}, RegisterResponse | HttpError, RegisterDto> = async(req, res, next): Promise<void> => {
    try {
      const validation = RegisterDtoSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: 'Validation erros',
          erros: validation.error.errors.map((error) => error.message)
        });
        return;
      }

      const { email, password, role } = validation.data;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        email,
        password: hashedPassword,
        role
      });

      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
      return;
    } catch (error) {
      res.status(400).json({ message: 'Error creating user' });
      return;
    }
  }

  public login: RequestHandler<{}, LoginResponse | HttpError, LoginDto> = async(req, res, next): Promise<void> => {
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
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
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
      return;
    } catch (error) {
      res.status(400).json({ message: 'Error logging in' });
      return;
    }
  }
}