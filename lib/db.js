import mongoose from "mongoose"

async function connectDB() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(`Connected to mongodb`);
    } catch (error) {
      console.error(`Problem connecting to mongodb: ${error}`);
    }
}
  
export default connectDB;