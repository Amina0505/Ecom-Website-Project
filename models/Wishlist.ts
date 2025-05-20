import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlistItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface IWishlist extends Document {
  userId: Schema.Types.ObjectId;
  items: IWishlistItem[];
}

const wishlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    productId: String,
    title: String,
    price: Number,
    image: String,
    category: String,
    description: String,
    rating: {
      rate: Number,
      count: Number
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IWishlist>('Wishlist', wishlistSchema); 