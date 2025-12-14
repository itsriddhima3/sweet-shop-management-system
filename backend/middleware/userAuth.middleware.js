import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const userAuth= async(req,res,next)=>{
    let token = req.cookies.token;

    // Also check Authorization header for Bearer token
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if(!token){
        return res.json({success:false, message:"unauthorized , Login again "});
    }
    try{
        const tokenDecoded=jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecoded.id){
            req.body.userId=tokenDecoded.id;
            const user = await User.findById(tokenDecoded.id);
            req.user = user;
        }
        else{
            return res.json({success:false, message:'Unauthorized'});
        }
        next();
    }
    catch(error){
        res.json({sucess:false, message:error.message});
    }

}

const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Authorization failed' });
  }
};




export { userAuth, adminAuth };