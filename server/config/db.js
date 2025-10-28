import mongoose from "mongoose";
import colors from "colors"; // Optional, install with: npm i colors

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(colors.green(`✅ MongoDB Connected: ${conn.connection.host}`));
  } catch (err) {
    console.error(colors.red(`❌ MongoDB Connection Error: ${err.message}`));
    process.exit(1);
  }
};

export default connectDB;
