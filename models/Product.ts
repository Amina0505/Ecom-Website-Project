import mongoose, { Document, Schema } from 'mongoose';

// Define the shape of the Product document in MongoDB
export interface IProductSchema {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  seller?: Schema.Types.ObjectId;
  storeName?: string;
  rating: {
    rate: number;
    count: number;
  };
  stock: number;
  isFeatured: boolean;
  isCustom: boolean;
  source: 'database' | 'frontend';
  // Custom id field for external products
  productId?: string;
  // Add review fields
  reviews?: Array<{
    user: string;
    name: string;
    rating: number;
    comment: string;
  }>;
  numOfReviews?: number;
  ratings?: number;
}

// The document type with Mongoose Document features
export interface IProductDocument extends Document, IProductSchema {
  // Additional mongoose document methods can be added here
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema({
  productId: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values to handle frontend products
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'fashion', 'furniture', 'grocery', 'gaming', 'beauty', 'books'],
  },
  image: {
    type: String,
    required: true,
  },
  // Add seller information
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  // Store name for display
  storeName: {
    type: String,
  },
  rating: {
    rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isCustom: {
    type: Boolean,
    default: true,
  },
  source: {
    type: String,
    enum: ['database', 'frontend'],
    default: 'database'
  },
  // Add review fields
  reviews: [{
    user: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    }
  }],
  numOfReviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

// Add text indexes for search functionality
productSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  storeName: 'text'
});

const Product = mongoose.model<IProductDocument>('Product', productSchema);

export default Product; 