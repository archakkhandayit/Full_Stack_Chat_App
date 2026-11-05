import mongoose from "mongoose";

export const connectDB1 = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    if (!MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }
    const instance = await mongoose.connect(MONGODB_URL);
    console.log(`MongoDB Connected: ${instance.connection.host}`);
  } catch (e) {
    console.error("MongoDB Connection Failed:", e.message);
    process.exit(1);
  }
};
