const mongoose = require('mongoose')
const dbUrl = process.env.MONGODB_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}
 const connectDB=async()=>{
    try {
      const conn = await mongoose.connect(dbUrl);
      console.log("Database connected successfully");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
    }
};
module.exports= connectDB;
    