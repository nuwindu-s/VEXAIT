import mongoose from 'mongoose';

/**
 * Global cache for MongoDB connection across serverless invocations
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB Atlas cluster with connection caching
 */
export const connectDB = async () => {
  const uri =
    process.env.MONGO_URI ||
    'mongodb+srv://vexait2026_db_user:EPRLus5Kl7Q4jnjo@cluster0.cbj5yta.mongodb.net/vexa_it?retryWrites=true&w=majority';

  if (!uri) {
    console.error('❌ Error: MONGO_URI is not defined in environment variables.');
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`✅ MongoDB Connected: ${mongooseInstance.connection.host} / Database: ${mongooseInstance.connection.name}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    return null;
  }

  return cached.conn;
};

export default connectDB;
