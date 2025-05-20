import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminDocument extends IAdmin, Document {
  _id: Schema.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAdminModel extends Model<IAdminDocument> {
  // Add any static methods here if needed
}

const adminSchema = new mongoose.Schema<IAdminDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const Admin = mongoose.model<IAdminDocument, IAdminModel>('Admin', adminSchema);

export default Admin; 