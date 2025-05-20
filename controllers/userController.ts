import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types/custom';

// Get all users (admin only)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.isAdmin) {
      console.log('Access denied: User is not admin');
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    console.log('Fetching all users...');
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    console.log(`Found ${users.length} users`);
    res.status(200).json({
      success: true,
      users,
      total: users.length,
      pages: 1,
      currentPage: 1
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching users'
    });
  }
};

// Get single user (admin only)
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching user'
    });
  }
};

// Update user (admin only)
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error updating user'
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error deleting user'
    });
  }
};

// Toggle user status (active/inactive)
export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deactivating the last admin
    if (user.role === 'admin' && user.isActive) {
      const activeAdminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the last active admin'
        });
      }
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error toggling user status'
    });
  }
};

// Request to become a seller
export const requestSellerStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { storeName, storeDescription } = req.body;

    if (!storeName) {
      return res.status(400).json({
        success: false,
        message: 'Store name is required'
      });
    }

    // Update user to become a seller
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Updating user to seller role:', {
      userId: user._id,
      currentRole: user.role,
      storeName: storeName
    });

    // If already a seller
    if (user.role === 'seller') {
      return res.status(400).json({
        success: false,
        message: 'User is already a seller'
      });
    }

    // Update user to seller role
    user.role = 'seller';
    user.storeName = storeName;
    user.storeDescription = storeDescription || '';
    user.isVerified = false; // New sellers start unverified
    
    await user.save();

    console.log('User successfully updated to seller:', {
      userId: user._id,
      newRole: user.role,
      storeName: user.storeName
    });

    res.status(200).json({
      success: true,
      message: 'Your account has been upgraded to seller status',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeName: user.storeName,
        storeDescription: user.storeDescription,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Error requesting seller status:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error requesting seller status'
    });
  }
};

// Verify a seller (admin only)
export const verifySeller = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'seller') {
      return res.status(400).json({
        success: false,
        message: 'User is not a seller'
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Seller has been verified',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeName: user.storeName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Error verifying seller:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error verifying seller'
    });
  }
}; 