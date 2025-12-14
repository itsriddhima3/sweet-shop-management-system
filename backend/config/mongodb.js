import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const connectDB= async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/sweetshop`)
        console.log('MongoDB connected successfully');
    }
    catch(err){
        console.log('error is : ',err);
        process.exit(1);
    }
};

export default connectDB;