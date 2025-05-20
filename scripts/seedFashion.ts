import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const fashionProducts = [
  {
    id: 'f1',
    title: 'Premium Leather Jacket',
    price: 299.99,
    description: 'Genuine leather jacket with modern design',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    rating: { rate: 4.6, count: 120 },
    stock: 40,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'f2',
    title: 'Designer Sunglasses',
    price: 159.99,
    description: 'UV protected premium sunglasses',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
    rating: { rate: 4.5, count: 90 },
    stock: 60,
    isCustom: true,
  },
  {
    id: 'f3',
    title: 'Classic Denim Jeans',
    price: 89.99,
    description: 'Premium denim jeans with perfect fit',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
    rating: { rate: 4.7, count: 150 },
    stock: 75,
    isCustom: true,
  },
  {
    id: 'f4',
    title: 'Casual Sneakers',
    price: 79.99,
    description: 'Comfortable and stylish sneakers for everyday wear',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    rating: { rate: 4.6, count: 200 },
    stock: 100,
    isCustom: true,
    isFeatured: true,
  }
];

const seedFashion = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing fashion products
    await Product.deleteMany({ category: 'fashion' });
    console.log('Cleared existing fashion products');

    // Insert new fashion products
    const insertedProducts = await Product.insertMany(fashionProducts);
    console.log(`Successfully inserted ${insertedProducts.length} fashion products`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding fashion products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedFashion(); 