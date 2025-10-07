import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import connectDB from './configs/mongodb.connect.js';
import authRoutes from './routes/auth.route.js';

dotenv.config() //env

const app = express(); //express
app.use(express.json())

connectDB() //connect Database mongoDB

app.use('/api/user', userRouter) //User Router

app.use("/api/auth", authRoutes)

app.listen(3000, () => {
    console.log('server is running on port 3000!!!')
})