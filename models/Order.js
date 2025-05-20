const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    items: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product'
        },
        name: {
          type: String,
          required: true
        },
        image: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ],
    shipping: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      }
    },
    payment: {
      method: {
        type: String,
        required: true,
        enum: ['credit_card', 'paypal', 'cash_on_delivery']
      },
      transactionId: {
        type: String
      },
      status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed', 'failed', 'refunded']
      }
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'return-requested',
        'returned',
        'refunded'
      ]
    },
    returnReason: {
      type: String
    },
    notes: {
      type: String
    },
    trackingNumber: {
      type: String
    },
    deliveredAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Define an index for performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 