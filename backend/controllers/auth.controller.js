import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from'../models/user.model.js';
import transporter from '../config/nodeMailer.js';

export const Register= async(req,res)=>{ 
    const {userName,userEmail,userPassword,role}=req.body;

    if(!userName || !userEmail || !userPassword){
        return res.json({success:false, message:'Details are missing'})
    }
    try{
        const existingUser = await User.findOne({userEmail})
        if(existingUser){
            return res.json({success:false, message:'User already exist'})
        }
        const hashPassword = await bcrypt.hash(userPassword,10);

        const user=new User({userEmail,userName,userPassword:hashPassword, role: userEmail === 'riddhima3007@gmail.com' ? 'admin' : 'user'});
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'? 'none':'strict',
            maxAge:7*24*60*60*1000                //this is time in milliseconds
        });

        //sending welcome email
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:userEmail,
            subject:'Welcome to our platform',
            text:`Welcome to our website. Your account has been created with email: ${userEmail}`
        }
        await transporter.sendMail(mailOptions);

        const userData = { id: user._id, userName: user.userName, userEmail: user.userEmail, role: user.role };
        return res.json({ success: true, token, user: userData });
    }
    catch(error){
        res.json({success:false , message:error.message})
    };
}

export const Login=async(req,res)=>{
     const {userEmail,userPassword}=req.body;
     if(!userEmail || !userPassword){
        res.json({success:false, message:'User not logged in!!'})
     }
     try{
         const user=await User.findOne({userEmail});
         if(!user){
            return res.json({success:false,message:'Invalid Email'})
         }
         const passMatch=await bcrypt.compare(userPassword, user.userPassword);
         if(!passMatch){
            return res.json({success:false,message:'Invalid Password'})
         }
         const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
         res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'? 'none':'strict',
            maxAge:7*24*60*60*1000                //this is time in milliseconds
         });

        const userData = { id: user._id, userName: user.userName, userEmail: user.userEmail, role: user.role };
        return res.json({ success: true, token, user: userData });
        }
     catch(error){
        res.json({success:false, message:error.message})
        }

}
 
export const Logout= async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'? 'none':'strict',
            maxAge:7*24*60*60*1000                //this is time in milliseconds
        });

        res.json({success:true,message:'Logged Out'});
    }
    catch(error){
        res.json({success:false, message:error.message})

    }
}

// send verification otp to the user email
export const verifyOtp = async(req,res)=>{
    try{
        const {userId} = req.body;
        const user = await User.findById(userId);

        if(user.isAccountVerified){
            res.json({success:false, message:'Already verified'})
        }
        const otp=String(Math.floor(100000+Math.random()*900000));

        user.verifyOtp=otp;
        user.verifyOtpExpiredAt=Date.now()+24*60*60*1000;

        await user.save();

        const mailOption={
            from:process.env.SENDER_EMAIL,
            to:user.userEmail,
            subject:'Account verification',
            text:`Your Otp is: ${otp}.Verify your account using this OTP.`    
        }
        await transporter.sendMail(mailOption);
        res.json({success:true,message:'otp send'});
    }
    catch(error){
        res.json({success:false, message:error.message})
    }

}

export const verifyEmail=async(req,res)=>{
    const {userId, otp}=req.body;
    if(!userId || !otp){
      return  res.json({success:false,message:'Details are missing'});
    }
    try{
        const user= await User.findById(userId);
        if(!user){
            return res.json({success:false,message:'User not found'});
        }
        if(user.verifyOtp===''|| user.verifyOtp!==otp){
            return res.json({success:false,message:'Invalid Otp'});
        }
        if(user.verifyOtpExpiredAt<Date.now()){
            return res.json({success:false, message:'Otp Expired'});
        }
           user.isAccountVerified=true; 
           user.verifyOtp='';
           user.verifyOtpExpiredAt=0;
           await user.save();
           return res.json({success:true,message:'Account Verified successfully'});

    }
    catch(error){
        res.json({success:false,message:error.message})
       
    }
}

export const isAuthenticated= async(req,res)=>{
    try{
        return res.json({success:true});
    }
    catch(error){
        res.json({success:false,message:error.message});
    }
}

export const sendResetOtp= async(req,res)=>{
  const {userEmail}=req.body;
  if(!userEmail){
    res.json({success:false,message:'Email is required'});
  }
  try{
    const user=await User.findOne({userEmail});
    if(!user){
        return res.json({success:false,message:'user not found.'}); 
    }
    const otp=String(Math.floor(100000+Math.random()*900000));

        user.resetOtp=otp;
        user.resetOtpExpiredAt=Date.now()+15*60*1000;

        await user.save();

        const mailOption={
            from:process.env.SENDER_EMAIL,
            to:user.userEmail,
            subject:'password reset otp',
            text:`Your Otp is: ${otp}. Reset password using this OTP.`    
        }
        await transporter.sendMail(mailOption);
        res.json({success:true,message:'otp send to your email'})
  }
  catch(error){
    res.json({success:false,message:error.message});
  }
}
//reset password
export const resetPassword= async(req,res)=>{
    const{userEmail, otp, newPassword}=req.body;
     if(!userEmail || !otp || !newPassword){
        res.json({success:false,message:'Email, Otp and new password are required.'})
     }
     try{
        const user= await User.findOne({userEmail});
        if(!user){
            return res.json({success:false,message:'user not found'}); 
        }
        if(user.resetOtp===''|| user.resetOtp!==otp){
            res.json({success:false,message:'Invalid otp'});
        }
        if(user.resetOtpExpiredAt<Date.now()){
            res.json({success:false,message:'Otp Expired'});
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.userPassword=hashedPassword;
        user.resetOtp='';
        user.resetOtpExpiredAt=0;
        await user.save();
        res.json({success:true, message:'Password is reset successfully'});
     }
     catch(error){
        res.json({success:false,message:error.message});
     }

}