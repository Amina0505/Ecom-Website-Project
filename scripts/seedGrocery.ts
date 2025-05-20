import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const groceryProducts = [
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

const seedGrocery = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing grocery products
    await Product.deleteMany({ category: 'grocery' });
    console.log('Cleared existing grocery products');

    // Insert new grocery products
    const insertedProducts = await Product.insertMany(groceryProducts);
    console.log(`Successfully inserted ${insertedProducts.length} grocery products`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding grocery products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedGrocery(); 