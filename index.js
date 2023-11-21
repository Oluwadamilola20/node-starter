import express from "express"
import dotenv from "dotenv"
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret not defined");
} 

app.use(express.json())

app.use("/api/auth", authRoutes);

connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}...`));