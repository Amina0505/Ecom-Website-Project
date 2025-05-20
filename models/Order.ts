import mongoose, { Document, Schema } from 'mongoose';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
}

interface PaymentDetails {
  method: 'card' | 'cod';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
}

export interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  items: OrderItem[];
  shipping: ShippingDetails;
  payment: PaymentDetails;
  totalAmount: number;
  status: string;
  returnReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    id: String,
    title: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shipping: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    phone: String,
    email: String
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'cod'],
      required: true
    },
    cardNumber: String,
    cardName: String,
    expiryDate: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'return-requested', 'cancelled'],
    default: 'pending'
  },
  returnReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', orderSchema); 