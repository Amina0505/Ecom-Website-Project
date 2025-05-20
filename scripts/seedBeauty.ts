import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const beautyProducts = [
  {
    id: 'be1',
    title: 'Premium Skincare Set',
    price: 89.99,
    description: 'Complete skincare routine set with natural ingredients',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    rating: { rate: 4.7, count: 150 },
    stock: 50,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'be2',
    title: 'Luxury Makeup Kit',
    price: 129.99,
    description: 'Professional makeup kit with essential products',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796',
    rating: { rate: 4.8, count: 200 },
    stock: 40,
    isCustom: true,
  }
];

const seedBeauty = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing beauty products
    await Product.deleteMany({ category: 'beauty' });
    console.log('Cleared existing beauty products');

    // Insert new beauty products
    const insertedProducts = await Product.insertMany(beautyProducts);
    console.log(`Successfully inserted ${insertedProducts.length} beauty products`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding beauty products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedBeauty(); 