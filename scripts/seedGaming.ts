import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const gamingProducts = [
  {
    id: 'g1',
    title: 'Gaming Console Pro',
    price: 499.99,
    description: 'Next-gen gaming console with 4K capabilities',
    category: 'gaming',
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128',
    rating: { rate: 4.9, count: 200 },
    stock: 25,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'g2',
    title: 'Gaming Mouse RGB',
    price: 49.99,
    description: 'High-precision gaming mouse with RGB lighting',
    category: 'gaming',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
    rating: { rate: 4.5, count: 180 },
    stock: 80,
    isCustom: true,
  },
  {
    id: 'g3',
    title: 'Gaming Headset Pro',
    price: 129.99,
    description: '7.1 surround sound gaming headset with noise cancellation',
    category: 'gaming',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb',
    rating: { rate: 4.7, count: 160 },
    stock: 45,
    isCustom: true,
  }
];

const seedGaming = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing gaming products
    await Product.deleteMany({ category: 'gaming' });
    console.log('Cleared existing gaming products');

    // Insert new gaming products
    const insertedProducts = await Product.insertMany(gamingProducts);
    console.log(`Successfully inserted ${insertedProducts.length} gaming products`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding gaming products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedGaming(); 