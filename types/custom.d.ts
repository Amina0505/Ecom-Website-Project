import { Request } from 'express';
import { IUserDocument } from '../models/User';
import { IAdminDocument } from '../models/Admin';

export interface AuthRequest extends Request {
  user?: IUserDocument | IAdminDocument;
  isAdmin?: boolean;
} 