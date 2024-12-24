import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  timestamp: Date;
  event: string;
  user: mongoose.Types.ObjectId;
  product?: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
}

const LogSchema: Schema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  event: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: false }
});

export const Log = mongoose.model<ILog>('Log', LogSchema);
