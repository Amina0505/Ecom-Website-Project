import { Request } from 'express';
import { IUserDocument } from '../models/User';
import { IAdminDocument } from '../models/Admin';

interface JwtPayload {
  id: string;
  isAdmin?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument | IAdminDocument;
      isAdmin?: boolean;
    }
  }
} 