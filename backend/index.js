import express from 'express';
import dotenv from "dotenv"
import { connectDB } from './db/connectDb.js';
import authRoutes from './routes/auth.routes.js'
const app=express();
app.use(express.json())
dotenv.config();
const PORT=process.env.PORT||5000;
app.get('/',(req,res)=>{
    res.send("hello world");
})

app.use("/api/auth",authRoutes);
app.listen(PORT,()=>{
connectDB();
console.log('server is runniong on port ',PORT)
})