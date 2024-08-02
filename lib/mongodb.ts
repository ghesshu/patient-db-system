import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.DB_URI as string; // Update if different

  try {
    await mongoose.connect(uri, {
      dbName: "PDS",
      serverSelectionTimeoutMS: 5000,
    });
    // console.log("Connected to Recruiters database using Mongoose");
  } catch (err) {
    console.error("Error connecting to MongoDB using Mongoose:", err);
  }
};

export default connectDB;
