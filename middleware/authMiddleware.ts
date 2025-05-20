import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/User';
import Admin, { IAdminDocument } from '../models/Admin';
import { JwtPayload } from '../types/express';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;
      
      // Check if it's an admin token
      if (decoded.isAdmin) {
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) {
          return res.status(401).json({ message: 'Admin not found' });
        }
        req.user = admin;
        req.isAdmin = true;
      } else {
        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.isAdmin) {
      return next(); // Admin has access to everything
    }
    
    const user = req.user as IUserDocument;
    if (!user || !user.role || !roles.includes(user.role)) {
      return res.status(403).json({
        message: `Role (${user?.role || 'unknown'}) is not allowed to access this resource`
      });
    }
    next();
  };
};

export const generateToken = (id: string, isAdmin: boolean = false) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
}; 