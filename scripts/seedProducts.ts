import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  // Electronics Category
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
  },

  // Fashion Category
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
  },

  // Gaming Category
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
  },

  // Books Category
  {
    id: 'b1',
    title: 'Best-Selling Novel Collection',
    price: 49.99,
    description: 'Collection of award-winning novels',
    category: 'books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    rating: { rate: 4.9, count: 300 },
    stock: 100,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'b2',
    title: 'Business Strategy Guide',
    price: 34.99,
    description: 'Comprehensive guide to modern business strategies',
    category: 'books',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    rating: { rate: 4.6, count: 120 },
    stock: 60,
    isCustom: true,
  },
  {
    id: 'b3',
    title: 'Science Fiction Anthology',
    price: 39.99,
    description: 'Collection of classic science fiction stories',
    category: 'books',
    image: 'https://images.unsplash.com/photo-1530538987395-032d1800fdd2',
    rating: { rate: 4.8, count: 180 },
    stock: 75,
    isCustom: true,
  },

  // Beauty Category
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
  },

  // Furniture Category
  {
    id: 'fu1',
    title: 'Modern Sofa Set',
    price: 999.99,
    description: 'Contemporary 3-piece sofa set with premium upholstery',
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    rating: { rate: 4.7, count: 90 },
    stock: 15,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'fu2',
    title: 'Ergonomic Office Chair',
    price: 199.99,
    description: 'Comfortable office chair with lumbar support',
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
    rating: { rate: 4.6, count: 120 },
    stock: 30,
    isCustom: true,
  },

  // Grocery Category
  {
    id: 'gr1',
    title: 'Organic Food Basket',
    price: 49.99,
    description: 'Selection of fresh organic fruits and vegetables',
    category: 'grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    rating: { rate: 4.8, count: 250 },
    stock: 100,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'gr2',
    title: 'Healthy Snack Pack',
    price: 29.99,
    description: 'Assorted healthy snacks and nuts',
    category: 'grocery',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    rating: { rate: 4.6, count: 180 },
    stock: 150,
    isCustom: true,
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 