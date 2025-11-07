import * as mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (globalThis as any).mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  (globalThis as any).mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error(
        "Please define the MONGODB_URI environment variable in .env file"
      );
    }

    // Log connection attempt (hide password for security)
    const safeUri = uri.includes('@')
      ? uri.replace(/\/\/([^:]+):([^@]+)@/, '//*****:*****@')
      : uri;
    console.log(`🔌 Attempting MongoDB connection to: ${safeUri}`);

    // Check if trying to connect to localhost (common mistake)
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      console.warn('⚠️  WARNING: Connecting to LOCAL MongoDB. Use Atlas URI for cloud database.');
    }

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Fail fast
    } as any;

    cached.promise = mongoose.connect(uri, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', err);
    throw err;
  }

  return cached.conn;
}
