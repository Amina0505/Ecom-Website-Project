import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const booksProducts = [
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
  }
];

const seedBooks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing books products
    await Product.deleteMany({ category: 'books' });
    console.log('Cleared existing books products');

    // Insert new books products
    const insertedProducts = await Product.insertMany(booksProducts);
    console.log(`Successfully inserted ${insertedProducts.length} books products`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding books products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedBooks(); 