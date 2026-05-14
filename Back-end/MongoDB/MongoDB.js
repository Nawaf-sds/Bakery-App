// Back-end/MongoDB/MongoDB.js
const mongoose = require('mongoose');
const config = require('../Config/Config'); 

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
  
      family: 4, 
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
