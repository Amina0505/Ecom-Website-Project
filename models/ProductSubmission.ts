import mongoose, { Document, Schema } from 'mongoose';

export interface IProductSubmission {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  seller: Schema.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  adminFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductSubmissionDocument extends Document, IProductSubmission {}

const productSubmissionSchema = new Schema<IProductSubmissionDocument>({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['electronics', 'fashion', 'furniture', 'grocery', 'gaming', 'beauty', 'books'],
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required'],
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller information is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminFeedback: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

const ProductSubmission = mongoose.model<IProductSubmissionDocument>('ProductSubmission', productSubmissionSchema);

export default ProductSubmission; 