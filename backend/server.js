import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from'./routes/authRoutes.js';
import sweetRouter from './routes/sweetRoutes.js';


const app = express();
dotenv.config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(cookieParser());
//api endpoints
app.get('/',(req,res)=>{
    res.send('APP IS WORKING');
})

app.use('/api/auth',authRouter);
app.use('/api/sweets',sweetRouter);


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.PORT}`)
});