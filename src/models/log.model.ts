import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  timestamp: Date;
  event: string;
  user: mongoose.Types.ObjectId;
  details: Record<string, any>;
}

const LogSchema: Schema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  event: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: Schema.Types.Mixed, required: true }
});

export const Log = mongoose.model<ILog>('Log', LogSchema);
