import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  quantity: number;
  category: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
}, {
  timestamps: true
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
