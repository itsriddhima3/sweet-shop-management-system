import express from 'express';
import { isAuthenticated, Login, Logout, Register, verifyEmail, verifyOtp,sendResetOtp,resetPassword } from '../controllers/auth.controller.js';
import { userAuth } from '../middleware/userAuth.middleware.js';
import { getUserData } from '../controllers/user.controller.js';

const authRouter=express.Router();

authRouter.post('/register',Register);
authRouter.post('/login',Login);
authRouter.post('/logout',Logout);
authRouter.post('/send-verify-otp',userAuth,verifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.post('/is-authenticated',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);
authRouter.get('/me',userAuth,getUserData)

export default authRouter;

