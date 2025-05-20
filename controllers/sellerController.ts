import { Request, Response } from 'express';
import ProductSubmission from '../models/ProductSubmission';
import Product from '../models/Product';
import User, { IUserDocument } from '../models/User';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/custom';

// Type guard to check if user is a regular user (not admin)
function isUserDocument(user: any): user is IUserDocument {
  return user && 'role' in user;
}

// Submit a new product (for sellers)
export const submitProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    console.log('Product submission request body:', req.body);

    // Check if user is a regular user
    if (!isUserDocument(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Only sellers can submit products'
      });
    }

    // Check if user is a seller
    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Only sellers can submit products'
      });
    }

    // Validate required fields
    const { title, description, price, category, image, stock } = req.body;
    
    if (!title || !description || !price || !category || !image) {
      console.log('Missing required fields:', {
        title: !!title,
        description: !!description,
        price: !!price,
        category: !!category,
        image: !!image
      });
      
      return res.status(400).json({
        success: false,
        message: 'All product fields are required'
      });
    }

    // Create a new product submission
    const submission = await ProductSubmission.create({
      ...req.body,
      seller: req.user._id
    });

    console.log('Product submission created successfully:', submission);

    res.status(201).json({
      success: true,
      submission
    });
  } catch (error) {
    console.error('Error submitting product:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error submitting product'
    });
  }
};

// Get seller's product submissions
export const getSellerSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if user is a regular user
    if (!isUserDocument(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if user is a seller
    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const submissions = await ProductSubmission.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    console.log('Seller submissions response:', {
      success: true,
      submissions: submissions
    });
    
    // Return with the correct format
    return res.status(200).json({
      success: true,
      submissions: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching submissions'
    });
  }
};

// Get seller dashboard stats
export const getSellerDashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if user is a regular user
    if (!isUserDocument(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if user is a seller
    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get submission stats
    const pendingCount = await ProductSubmission.countDocuments({ 
      seller: req.user._id,
      status: 'pending'
    });
    
    const approvedCount = await ProductSubmission.countDocuments({ 
      seller: req.user._id,
      status: 'approved'
    });
    
    const rejectedCount = await ProductSubmission.countDocuments({ 
      seller: req.user._id,
      status: 'rejected'
    });

    // Get active products stats
    const activeProducts = await Product.countDocuments({
      seller: req.user._id
    });

    // Log the response for debugging
    console.log('Seller dashboard response:', {
      success: true,
      stats: {
        pendingSubmissions: pendingCount,
        approvedSubmissions: approvedCount,
        rejectedSubmissions: rejectedCount,
        activeProducts: activeProducts
      }
    });

    // Return the stats in the expected format
    return res.status(200).json({
      success: true,
      stats: {
        pendingSubmissions: pendingCount,
        approvedSubmissions: approvedCount,
        rejectedSubmissions: rejectedCount,
        activeProducts: activeProducts
      }
    });
  } catch (error) {
    console.error('Error fetching seller dashboard:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching seller dashboard'
    });
  }
}; 