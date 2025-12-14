import mongoose from'mongoose';


const userSchema= new mongoose.Schema({
    userName:{
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    userEmail:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        lowercase:true
    },
    userPassword:{
        type:String,
        required:[true,'Password is required']   
    },
    verifyOtp:{
        type:String,
        default:''
    },
    verifyOtpExpiredAt:{
        type:Number,
        default:0
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    resetOtp:{
        type:String,
        default:''
    },
    resetOtpExpiredAt:{
        type:Number,
        default:0
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    lastLogin: {
    type: Date
    }

},{timestamps:true});

//the export line is written with OR operator beacuse if themodel is already present it won't crete the model again.
export  const User = mongoose.models.User || mongoose.model('User',userSchema);
