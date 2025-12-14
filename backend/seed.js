import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Sweet } from './models/sweet.model.js';
import connectDB from './config/mongodb.js';

dotenv.config();

const seedSweets = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing sweets
    await Sweet.deleteMany({});
    console.log('Cleared existing sweets');

    // Sample sweets data
    const sweetsData = [
      {
        sweetName: 'Chocolate Bar',
        sweetCategory: 'chocolate',
        sweetPrice: 2.99,
        sweetQuantity: 50,
        sweetDescription: 'Delicious milk chocolate bar',
        sweetImageUrl: 'https://via.placeholder.com/300x200?text=Chocolate+Bar'
      },
      {
        sweetName: 'Gummy Bears',
        sweetCategory: 'gummy',
        sweetPrice: 1.50,
        sweetQuantity: 30,
        sweetDescription: 'Colorful gummy bears',
        sweetImageUrl: 'https://via.placeholder.com/300x200?text=Gummy+Bears'
      },
      {
        sweetName: 'Sour Candies',
        sweetCategory: 'sour',
        sweetPrice: 1.25,
        sweetQuantity: 0,
        sweetDescription: 'Extra sour candies',
        sweetImageUrl: 'https://via.placeholder.com/300x200?text=Sour+Candies'
      },
      {
        sweetName: 'Mint Candies',
        sweetCategory: 'mint',
        sweetPrice: 0.99,
        sweetQuantity: 100,
        sweetDescription: 'Refreshing mint candies',
        sweetImageUrl: 'https://via.placeholder.com/300x200?text=Mint+Candies'
      },
      {
        sweetName: 'Lollipop',
        sweetCategory: 'lollipop',
        sweetPrice: 0.75,
        sweetQuantity: 3,
        sweetDescription: 'Giant lollipop',
        sweetImageUrl: 'https://via.placeholder.com/300x200?text=Lollipop'
      }
    ];

    const sweets = await Sweet.insertMany(sweetsData);
    console.log(`Seeded ${sweets.length} sweets successfully`);

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedSweets();