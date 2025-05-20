import { Request, Response } from 'express';
import ProductSubmission, { IProductSubmissionDocument } from '../models/ProductSubmission';
import Product from '../models/Product';
import User, { IUserDocument } from '../models/User';
import { IAdminDocument } from '../models/Admin';
import { AuthRequest } from '../types/custom';

// Get all product submissions for admin review
export const getProductSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { status = 'pending' } = req.query;
    
    // Allow filtering by status
    const query: any = {};
    if (status) {
      query.status = status;
    }

    const submissions = await ProductSubmission.find(query)
      .populate('seller', 'name email storeName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      submissions,
      count: submissions.length
    });
  } catch (error) {
    console.error('Error fetching product submissions:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching product submissions'
    });
  }
};

// Get a single product submission by ID
export const getProductSubmission = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const submission = await ProductSubmission.findById(req.params.id)
      .populate('seller', 'name email storeName');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      submission
    });
  } catch (error) {
    console.error('Error fetching product submission:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching product submission'
    });
  }
};

// Approve a product submission
export const approveSubmission = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    console.log('Approving submission with ID:', req.params.id);
    
    const submission = await ProductSubmission.findById(req.params.id) as IProductSubmissionDocument;
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    if (submission.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This submission is already approved'
      });
    }

    // Find the seller
    const seller = await User.findById(submission.seller);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    console.log('Creating product from submission for seller:', seller._id);
    
    // Create a new product from the submission
    const productData = {
      title: submission.title,
      description: submission.description,
      price: submission.price,
      category: submission.category,
      image: submission.image,
      stock: submission.stock,
      seller: submission.seller,
      storeName: seller.storeName || seller.name,
      rating: {
        rate: 0,
        count: 0
      },
      isFeatured: false,
      isCustom: true,
      source: 'database'
    };
    
    console.log('Product data to be created:', productData);
    
    const product = await Product.create(productData);
    console.log('Product created successfully with ID:', product._id);

    // Update submission status
    submission.status = 'approved';
    submission.adminFeedback = req.body.feedback || 'Your product has been approved and is now listed on the store.';
    await submission.save();
    console.log('Submission status updated to approved');

    res.status(200).json({
      success: true,
      message: 'Product approved and published',
      product,
      submission
    });
  } catch (error) {
    console.error('Error approving submission:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error approving submission'
    });
  }
};

// Reject a product submission
export const rejectSubmission = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { feedback } = req.body;
    
    if (!feedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback is required when rejecting a submission'
      });
    }

    const submission = await ProductSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    if (submission.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'This submission is already rejected'
      });
    }

    // Update submission status
    submission.status = 'rejected';
    submission.adminFeedback = feedback;
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Product submission rejected',
      submission
    });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error rejecting submission'
    });
  }
}; 