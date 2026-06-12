const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(
      "❌ MongoDB Error: MONGO_URI is not set. Add a valid MongoDB connection string to backend/.env."
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    console.error(
      "Hint: 'bad auth' means your MongoDB username or password is incorrect, or your URI is malformed."
    );
    console.error(
      "Update backend/.env with a valid MONGO_URI, or use a local MongoDB at mongodb://localhost:27017/chatflow."
    );
    process.exit(1);
  }
};

module.exports = connectDB;
