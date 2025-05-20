import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const electronicProducts = [
  {
    id: 'e13',
    title: 'Smart Home Security Camera',
    price: 129.99,
    description: '1080p HD wireless security camera with night vision and motion detection',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb',
    rating: { rate: 4.7, count: 180 },
    stock: 45,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'e14',
    title: 'Portable Power Bank 20000mAh',
    price: 49.99,
    description: 'Fast-charging power bank with USB-C and multiple ports',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1583864697784-a0ef3b72e8b6',
    rating: { rate: 4.6, count: 220 },
    stock: 80,
    isCustom: true,
  },
  {
    id: 'e15',
    title: 'Smart Doorbell Pro',
    price: 199.99,
    description: 'Video doorbell with two-way audio and motion alerts',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb',
    rating: { rate: 4.8, count: 150 },
    stock: 35,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'e16',
    title: 'Wireless Charging Pad',
    price: 39.99,
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1583864697784-a0ef3b72e8b6',
    rating: { rate: 4.5, count: 190 },
    stock: 60,
    isCustom: true,
  },
  {
    id: 'e17',
    title: 'Smart Thermostat',
    price: 249.99,
    description: 'WiFi-enabled smart thermostat with energy saving features',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126',
    rating: { rate: 4.7, count: 140 },
    stock: 25,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'e18',
    title: 'Robot Vacuum Cleaner',
    price: 299.99,
    description: 'Smart robot vacuum with mapping and scheduling capabilities',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1583864697784-a0ef3b72e8b6',
    rating: { rate: 4.6, count: 170 },
    stock: 30,
    isCustom: true,
  },
  {
    id: 'e19',
    title: 'Smart Door Lock',
    price: 179.99,
    description: 'Fingerprint and app-controlled smart door lock',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126',
    rating: { rate: 4.8, count: 120 },
    stock: 40,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'e20',
    title: 'Wireless Keyboard and Mouse Set',
    price: 79.99,
    description: 'Ergonomic wireless keyboard and mouse combo',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
    rating: { rate: 4.5, count: 160 },
    stock: 55,
    isCustom: true,
  },
  {
    id: 'e21',
    title: 'Smart LED Bulb Pack',
    price: 89.99,
    description: 'Set of 4 WiFi-enabled color-changing smart bulbs',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126',
    rating: { rate: 4.7, count: 130 },
    stock: 70,
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'e22',
    title: 'Portable Projector',
    price: 399.99,
    description: 'Mini portable projector with HD resolution and built-in speakers',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126',
    rating: { rate: 4.6, count: 110 },
    stock: 20,
    isCustom: true,
  }
];

const addElectronics = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Insert new electronic products
    const insertedProducts = await Product.insertMany(electronicProducts);
    console.log(`Successfully inserted ${insertedProducts.length} new electronic products`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error adding electronic products:', error);
    process.exit(1);
  }
};

// Run the function
addElectronics(); 