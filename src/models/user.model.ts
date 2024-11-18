import mongoose, { Document, Schema } from 'mongoose';
import { IUser, UserRole } from '../types/user';

export interface UserDocument extends IUser, Document {}

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

export const User = mongoose.model<UserDocument>('User', userSchema);