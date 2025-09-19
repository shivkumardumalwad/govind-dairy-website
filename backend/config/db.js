import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Load .env file from the root of the backend folder
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is undefined. Check your .env file and dotenv config path.');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
