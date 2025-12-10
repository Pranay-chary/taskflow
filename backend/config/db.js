import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    // Debug: Log environment check
    console.log('=== MongoDB Connection Debug ===');
    console.log('MONGODB_URI exists:', !!mongoURI);
    console.log('MONGODB_URI value:', mongoURI ? `${mongoURI.substring(0, 20)}...` : 'NOT SET');
    console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('PORT')));
    
    if (!mongoURI) {
      console.error('❌ ERROR: MONGODB_URI environment variable is not set');
      console.error('Please set MONGODB_URI in Render Dashboard → Environment tab');
      console.error('Go to: https://dashboard.render.com → Your Service → Environment');
      process.exit(1);
    }
    
    // Add database name if not present
    let connectionString = mongoURI;
    if (!connectionString.includes('/?') && !connectionString.match(/\/\w+/)) {
      connectionString = connectionString.replace('?', '/taskflow?');
    }
    
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', connectionString.substring(0, 30) + '...');
    
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 10000, // Increased timeout for production
      socketTimeoutMS: 45000, // Socket timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Error details:', error);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n🔍 Troubleshooting:');
      console.error('1. Check MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)');
      console.error('2. Verify MONGODB_URI is set correctly in Render');
      console.error('3. Check MongoDB Atlas connection string format');
    }
    
    process.exit(1);
  }
};

export default connectDB;
