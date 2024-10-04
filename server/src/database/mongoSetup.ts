import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const mongoSetup = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }
    console.log('🎲️ Connecting to Database...');
    await mongoose.connect(process.env.DB_CONNECT_URL ?? '', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅️ Connected to Database');
  } catch (error) {
    throw new Error(
      `❌️ Error connecting to MongoDB: ${(error as Error).message}`,
    );
  }
};
