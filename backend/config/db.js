import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas cluster
 */
export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ Error: MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB Reconnected successfully.');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Initial Connection Failed: ${error.message}`);
    // Optional retry logic if server should keep running
    return null;
  }
};

export default connectDB;
