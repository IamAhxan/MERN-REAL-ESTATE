import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './configs/mongodb.connect.js';
import userRouter from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import listingRoutes from './routes/listing.route.js';

dotenv.config();
const app = express();

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // ✅ allow cookies
}));
app.use(cookieParser());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ success: false, message, statusCode });
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
