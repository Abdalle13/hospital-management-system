import dns from 'dns';
import mongoose from 'mongoose';

// Windows sometimes points Node's resolver at 127.0.0.1 with nothing listening
// there, which breaks the SRV lookup mongodb+srv:// needs even though the OS
// itself resolves fine. Force known-good public resolvers as a fallback.
dns.setServers([...dns.getServers(), '8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MongoDB connection string is missing. Set MONGO_URI or MONGODB_URI to your Atlas connection string.');
  }

  try {
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`   Using URI: ${mongoURI.startsWith('mongodb+srv://') ? '[Atlas SRV URI]' : mongoURI}`);
    process.exit(1);
  }
};

export default connectDB;
