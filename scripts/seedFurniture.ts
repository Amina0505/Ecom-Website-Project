import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const furnitureProducts = [
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
  }
];

const seedFurniture = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing furniture products
    await Product.deleteMany({ category: 'furniture' });
    console.log('Cleared existing furniture products');

    // Insert new furniture products
    const insertedProducts = await Product.insertMany(furnitureProducts);
    console.log(`Successfully inserted ${insertedProducts.length} furniture products`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding furniture products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedFurniture(); 