import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';
import { MongoError } from 'mongodb';

dotenv.config();

const shoesProducts = [
  {
    id: 'shoe_nike_001',
    title: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers unrivaled comfort with its large Air unit, perfect for all-day wear.',
    price: 150.00,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    rating: {
      rate: 4.8,
      count: 120
    },
    stock: 15,
    isFeatured: true,
    isCustom: true,
    source: 'database'
  },
  {
    id: 'shoe_adidas_001',
    title: 'Adidas Ultra Boost',
    description: 'Experience ultimate comfort with the Adidas Ultra Boost running shoes featuring responsive cushioning.',
    price: 180.00,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1549298916-b41d0d72c35a',
    rating: {
      rate: 4.7,
      count: 95
    },
    stock: 12,
    isFeatured: true,
    isCustom: true,
    source: 'database'
  },
  {
    id: 'shoe_puma_001',
    title: 'Puma RS-X',
    description: 'The Puma RS-X combines retro style with modern comfort for a unique sneaker experience.',
    price: 130.00,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f',
    rating: {
      rate: 4.6,
      count: 85
    },
    stock: 10,
    isFeatured: true,
    isCustom: true,
    source: 'database'
  },
  {
    id: 'shoe_nb_001',
    title: 'New Balance 574',
    description: 'Classic comfort meets timeless style with the New Balance 574 sneaker.',
    price: 110.00,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    rating: {
      rate: 4.5,
      count: 75
    },
    stock: 8,
    isFeatured: true,
    isCustom: true,
    source: 'database'
  },
  {
    id: 'shoe_reebok_001',
    title: 'Reebok Classic Leather',
    description: 'The Reebok Classic Leather sneaker offers premium comfort and durability.',
    price: 100.00,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1549298916-b41d0d72c35a',
    rating: {
      rate: 4.4,
      count: 65
    },
    stock: 15,
    isFeatured: true,
    isCustom: true,
    source: 'database'
  }
];

const seedShoes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing shoes products
    await Product.deleteMany({ 
      category: 'fashion',
      id: { $in: shoesProducts.map(product => product.id) }
    });
    console.log('Cleared existing shoes products');

    // Insert new shoes products one by one to handle potential duplicates
    for (const product of shoesProducts) {
      try {
        await Product.create(product);
        console.log(`Added product: ${product.title}`);
      } catch (error) {
        const mongoError = error as MongoError;
        if (mongoError.code === 11000) {
          console.log(`Skipping duplicate product: ${product.title}`);
        } else {
          throw error;
        }
      }
    }

    console.log('Successfully seeded shoes products');
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding shoes products:', error);
    process.exit(1);
  }
};

seedShoes(); 