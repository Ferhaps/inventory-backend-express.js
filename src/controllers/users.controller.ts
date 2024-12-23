import { UserDto } from "../dto/user.dto";
import { User } from "../models/user.model";
import { Request, Response } from 'express';

export class UsersController {
  public async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      const userDtos: UserDto[] = users.map(user => {
        return {
          email: user.email,
          role: user.role
        };
      });
      res.json(userDtos);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching users', error });
    }
  }
}
