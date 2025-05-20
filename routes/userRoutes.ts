import express, { Request, Response } from 'express';
import { generateToken } from '../middleware/authMiddleware';
import User, { IUserDocument } from '../models/User';
import { protect } from '../middleware/authMiddleware';
import { requestSellerStatus } from '../controllers/userController';

const router = express.Router();

// Register user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    if (!user) {
      return res.status(400).json({ message: 'Failed to create user' });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString())
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email and include password for comparison
    const user = await User.findOne({ email }).select('+password') as IUserDocument | null;
    
    if (!user) {
      console.log('Login attempt failed: User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      console.log('Login attempt failed: Invalid password for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    console.log('Login successful for user:', user.email);
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString())
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again later.'
    });
  }
});

// Get user profile
router.get('/profile', protect, async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', protect, async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, currentPassword, newPassword } = req.body;

    // Find user with password included for verification
    const user = await User.findById(req.user._id).select('+password') as IUserDocument | null;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If trying to change password, verify current password
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found after update' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Become a seller
router.post('/become-seller', protect, requestSellerStatus);

export default router; 