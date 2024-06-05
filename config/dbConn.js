const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ensure the DATABASE_URI environment variable is loaded
    const dbURI = process.env.DATABASE_URI;
    if (!dbURI) {
      throw new Error('DATABASE_URI is not defined in environment variables');
    }

    // Connect to the database
    const conn = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Additional options can be added here if needed
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
