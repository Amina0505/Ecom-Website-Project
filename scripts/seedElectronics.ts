import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const electronicsProducts = [
  {
    id: 'e1',
    title: 'Premium Wireless Headphones',
    price: 199.99,
    description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    rating: { rate: 4.8, count: 250 },
    stock: 50,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'e2',
    title: '4K Smart TV - 55 inch',
    price: 699.99,
    description: 'Ultra HD Smart TV with HDR, built-in streaming apps, and voice control',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6',
    rating: { rate: 4.7, count: 180 },
    stock: 30,
    isCustom: true,
  },
  {
    id: 'e3',
    title: 'Professional Camera DSLR',
    price: 1299.99,
    description: '24.1MP Digital SLR Camera with 4K video recording and advanced autofocus system',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    rating: { rate: 4.9, count: 120 },
    stock: 25,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'e4',
    title: 'Smart Watch Series X',
    price: 349.99,
    description: 'Advanced smartwatch with health monitoring, GPS, and cellular connectivity',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    rating: { rate: 4.6, count: 300 },
    stock: 45,
    isCustom: true,
  },
  {
    id: 'e5',
    title: 'Wireless Gaming Mouse',
    price: 79.99,
    description: 'High-precision gaming mouse with RGB lighting and programmable buttons',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
    rating: { rate: 4.5, count: 150 },
    stock: 60,
    isCustom: true,
  },
  {
    id: 'e6',
    title: 'Bluetooth Speaker System',
    price: 159.99,
    description: 'Powerful wireless speaker with deep bass and 360-degree sound',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    rating: { rate: 4.7, count: 200 },
    stock: 40,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'e7',
    title: 'Ultra-Slim Laptop Pro',
    price: 1299.99,
    description: '14-inch laptop with 4K display, 16GB RAM, and 1TB SSD',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    rating: { rate: 4.8, count: 280 },
    stock: 35,
    isCustom: true,
  },
  {
    id: 'e8',
    title: 'Wireless Earbuds Pro',
    price: 149.99,
    description: 'True wireless earbuds with noise cancellation and wireless charging case',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb',
    rating: { rate: 4.6, count: 220 },
    stock: 55,
    isCustom: true,
  },
  {
    id: 'e9',
    title: 'Smart Home Hub',
    price: 129.99,
    description: 'Central smart home controller with voice assistant and home automation',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126',
    rating: { rate: 4.5, count: 170 },
    stock: 42,
    isCustom: true,
  },
  {
    id: 'e10',
    title: '4K Drone with Camera',
    price: 799.99,
    description: 'Professional drone with 4K camera, GPS, and 30-minute flight time',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31',
    rating: { rate: 4.7, count: 190 },
    stock: 20,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'e11',
    title: 'Gaming Console Elite',
    price: 499.99,
    description: 'Next-gen gaming console with 1TB storage and 4K gaming capability',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128',
    rating: { rate: 4.9, count: 320 },
    stock: 30,
    isCustom: true,
  },
  {
    id: 'e12',
    title: 'Mechanical Gaming Keyboard',
    price: 129.99,
    description: 'RGB mechanical keyboard with customizable keys and wrist rest',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1595225353945-8c726fd293fa',
    rating: { rate: 4.6, count: 210 },
    stock: 48,
    isCustom: true,
  }
];

const seedElectronics = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing electronics products
    await Product.deleteMany({ category: 'electronics' });
    console.log('Cleared existing electronics products');

    // Insert new electronics products
    const insertedProducts = await Product.insertMany(electronicsProducts);
    console.log(`Successfully inserted ${insertedProducts.length} electronics products`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding electronics products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedElectronics(); 