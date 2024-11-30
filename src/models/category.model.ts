import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  products: mongoose.Types.ObjectId[];
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, {
  timestamps: true
});

export default mongoose.model<ICategory>('Category', CategorySchema);
