import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'seller';
  isActive: boolean;
  storeName?: string;
  storeDescription?: string;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type IUserDocument = Document<Schema.Types.ObjectId, {}, IUser> & IUser & IUserMethods;

// Type for user document without methods (for query results)
export type IUserDocumentWithoutMethods = Omit<IUserDocument, keyof IUserMethods>;

export interface IUserModel extends Model<IUserDocument> {
  // Add any static methods here if needed
}

const userSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [50, 'Your name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [6, 'Your password must be at least 6 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'seller'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Seller-specific fields
  storeName: {
    type: String,
    maxLength: [100, 'Store name cannot exceed 100 characters']
  },
  storeDescription: {
    type: String,
    maxLength: [500, 'Store description cannot exceed 500 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(this: IUserDocument, next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare user password
userSchema.methods.comparePassword = async function(
  this: IUserDocument,
  enteredPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User; 