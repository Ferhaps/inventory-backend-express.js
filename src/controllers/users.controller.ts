import { UserDto } from "../dto/user.dto";
import { Log } from "../models/log.model";
import { User } from "../models/user.model";
import { Response } from 'express';
import { LogEvent } from "../types/log";
import { AuthRequest } from "../types/authRequest";

export class UsersController {
  public async getUsers(req: AuthRequest, res: Response) {
    try {
      const users = await User.find();
      const userDtos: UserDto[] = users.map(user => {
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role
        };
      });
      res.json(userDtos);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching users', error });
      return;
    }
  }

  public async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(204).end();

      Log.create({
        event: LogEvent.USER_DELETE,
        user: req.user.id,
        details: `Deleted user ${user.email}`
      }).catch(err => console.error('Error creating delete log:', err));
    } catch (error) {
      res.status(400).json({ message: 'Error deleting user', error });
      return;
    }
  }
}
