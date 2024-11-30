import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '../types/user';

interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.ADMIN
  }
});

export const User = mongoose.model<IUser>('User', userSchema);