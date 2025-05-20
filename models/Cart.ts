import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './User';

export interface ICartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ICart extends Document {
  userId: Schema.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    id: String,
    title: String,
    price: Number,
    image: String,
    quantity: Number
  }],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<ICart>('Cart', cartSchema); 