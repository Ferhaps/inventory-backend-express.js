import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  timestamp: Date;
  event: string;
  user: mongoose.Types.ObjectId;
  product?: {
    id: mongoose.Types.ObjectId;
    name: string;
  };
  category?: {
    id: mongoose.Types.ObjectId;
    name: string;
  };
}

const LogSchema: Schema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  event: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: {
    id: { type: Schema.Types.ObjectId, required: false },
    name: { type: String, required: false }
  },
  category: {
    id: { type: Schema.Types.ObjectId, required: false },
    name: { type: String, required: false }
  }
});

export const Log = mongoose.model<ILog>('Log', LogSchema);
