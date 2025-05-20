const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res, next) => {
  const { items, shipping, payment, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError('No order items', 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check for product availability and update stock
    for (const item of items) {
      const product = await Product.findById(item.id).session(session);
      
      if (!product) {
        throw new AppError(`Product ${item.id} not found`, 404);
      }
      
      if (product.stock < item.quantity) {
        throw new AppError(`Product ${product.name} is out of stock`, 400);
      }
      
      // Update stock
      product.stock -= item.quantity;
      await product.save({ session });
    }

    // Create order
    const order = await Order.create(
      [{
        userId: req.user._id,
        items,
        shipping,
        payment,
        totalAmount
      }], 
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: order[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Make sure user owns the order or user is admin
  if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this order', 401));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ userId: req.user._id });

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: orders
  });
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Make sure user owns the order or user is admin
  if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to cancel this order', 401));
  }

  // Check if order can be cancelled
  if (order.status !== 'pending' && order.status !== 'processing') {
    return next(new AppError('Order cannot be cancelled', 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update stock
    for (const item of order.items) {
      const product = await Product.findById(item.id).session(session);
      if (product) {
        product.stock += item.quantity;
        await product.save({ session });
      }
    }

    // Update order status
    order.status = 'cancelled';
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
});

// @desc    Request a return
// @route   PUT /api/orders/:id/return
// @access  Private
const requestReturn = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason) {
    return next(new AppError('Please provide a reason for return', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Make sure user owns the order
  if (order.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to return this order', 401));
  }

  // Check if order can be returned
  if (order.status !== 'delivered') {
    return next(new AppError('Only delivered orders can be returned', 400));
  }

  // Update order status
  order.status = 'return-requested';
  order.returnReason = reason;
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.userId) {
    filter.userId = req.query.userId;
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name email');

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: orders
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/admin/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Update order status
  order.status = status;
  
  // If status is delivered, set deliveredAt
  if (status === 'delivered') {
    order.deliveredAt = Date.now();
  }
  
  // If tracking number is provided
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get order stats (admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res, next) => {
  // Get counts by status
  const statusCounts = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  // Get total revenue
  const revenueStats = await Order.aggregate([
    {
      $match: {
        status: { $in: ['delivered', 'shipped', 'processing'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      }
    }
  ]);

  // Get daily revenue for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      statusCounts,
      revenueStats: revenueStats[0] || { totalRevenue: 0, count: 0 },
      dailyRevenue
    }
  });
});

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
}; 