import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    let mongoURI = process.env.MONGODB_URI;
    
    // Debug: Log environment check
    console.log('=== MongoDB Connection Debug ===');
    console.log('Environment:', isProduction ? 'production' : 'development');
    console.log('MONGODB_URI exists:', !!mongoURI);
    
    // Handle missing MONGODB_URI
    if (!mongoURI) {
      if (isProduction) {
        // Production requires MONGODB_URI
        console.error('❌ ERROR: MONGODB_URI environment variable is not set');
        console.error('Please set MONGODB_URI in Render Dashboard → Environment tab');
        console.error('Go to: https://dashboard.render.com → Your Service → Environment');
        process.exit(1);
      } else {
        // Development: Use fallback to local MongoDB or provide helpful message
        console.warn('⚠️  MONGODB_URI not set. Using fallback for local development...');
        console.warn('💡 To use a specific MongoDB URI, create a .env file in the backend folder with:');
        console.warn('   MONGODB_URI=your_mongodb_connection_string');
        console.warn('   PORT=5000');
        console.warn('   NODE_ENV=development');
        
        // Try to use local MongoDB as fallback
        mongoURI = 'mongodb://localhost:27017/taskflow';
        console.log('🔄 Attempting to connect to local MongoDB:', mongoURI);
      }
    } else {
      console.log('MONGODB_URI value:', mongoURI.substring(0, 20) + '...');
    }
    
    // Add database name if not present (for MongoDB Atlas connections)
    let connectionString = mongoURI;
    const isAtlasConnection = mongoURI.includes('mongodb+srv://') || (mongoURI.includes('mongodb://') && mongoURI.includes('@'));
    if (isAtlasConnection) {
      // Only modify Atlas connection strings, not local ones
      if (!connectionString.includes('/?') && !connectionString.match(/\/\w+/)) {
        connectionString = connectionString.replace('?', '/taskflow?');
      }
    }
    
    console.log('Attempting to connect to MongoDB...');
    if (isProduction || mongoURI.includes('mongodb+srv://')) {
      console.log('Connection string:', connectionString.substring(0, 30) + '...');
    } else {
      console.log('Connection string:', connectionString);
    }
    
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: isProduction ? 10000 : 5000, // Longer timeout for production
      socketTimeoutMS: 45000, // Socket timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Error details:', error);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n🔍 Troubleshooting:');
      const isProduction = process.env.NODE_ENV === 'production';
      if (isProduction) {
        console.error('1. Check MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)');
        console.error('2. Verify MONGODB_URI is set correctly in Render');
        console.error('3. Check MongoDB Atlas connection string format');
      } else {
        console.error('1. Make sure MongoDB is running locally (mongod)');
        console.error('2. Or create a .env file with MONGODB_URI pointing to MongoDB Atlas');
        console.error('3. Check that the connection string is correct');
      }
    }
    
    process.exit(1);
  }
};

export default connectDB;
