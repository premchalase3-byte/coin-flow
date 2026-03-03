import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // make sure environment variables load

export const connectDB = async () => {
  try {
    // Debug log to confirm .env is loading
    console.log("Loaded MONGO_URL:", process.env.MONGO_URL);

    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};