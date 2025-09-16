const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('MongoDB URI preview:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('IP')) {
      console.log('\n🔧 SOLUTION: Add your IP to MongoDB Atlas whitelist');
      console.log('1. Go to MongoDB Atlas Dashboard');
      console.log('2. Network Access → IP Access List');
      console.log('3. Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n🔧 SOLUTION: Check your credentials');
      console.log('Username/password might be incorrect');
    }
  } finally {
    mongoose.disconnect();
  }
};

testConnection();