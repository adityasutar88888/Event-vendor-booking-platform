const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventease';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed.');
    console.error(error.message);
    console.error('Ensure MongoDB is running locally at mongodb://127.0.0.1:27017/eventease');
    process.exit(1);
  }
};

module.exports = connectDB;

