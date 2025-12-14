import { User } from "../models/user.model.js";

export const getUserData=async(req,res)=>{
    try{
        const {userId}=req.body;
        const user=await User.findOne(userId);
        if(!user){
            res.json({success:false,message:'user not found'});
        }
        res.json({
            success:true,
            userData:{
                name:user.userName,
                isAccountVerified:user.isAccountVerified      
            }
        });
    }
    catch(error){
        res.json({success:false,message:error.message});
    }
}