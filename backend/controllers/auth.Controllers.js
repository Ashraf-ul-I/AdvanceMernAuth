import { User } from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendForgotPassword, sendVerificationEmail, sendWelcomeEmail,sendResetSuccesMessage } from "../mailtrap/email.js";

export const login=async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
     throw new Error("All fileds are required");
    }
    try {
        const user=await User.findOne({email});
        if(!user){
            res.status(400).json({success:false,message:"Invalid Credentials"})
        }

        const isPasswordValid=await bcryptjs.compare(password,user.password);

        if(!isPasswordValid){
            res.status(400).json({success:false,message:"Invalid Credentials"})
        }

        generateTokenAndSetCookie(res,user._id);

        user.lastLogin=new Date();
        await user.save();

        res.status(200).json({
            success:true,
            message:"Logged in sucessfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })
        
    } catch (error) {
        res.status(400).json({success:false,message:"Invalid Credentials"})
    }
}

export const signup=async (req,res)=>{
    const {email,password,name}=req.body;

    try {
        if(!email || !password || !name){
            throw new Error("All fileds are required");
        }

        const userAlreadyExist=await User.findOne({email});
        
        if(userAlreadyExist){
            return res.status(400).json({success:false,message:"User already Exists"})
        }

        const hashedPassword=await bcryptjs.hash(password,10);
        const verificationToken=generateVerificationCode();
        console.log(verificationToken);
        // after completing the checking of data and hashed the password 
        // we are going to make new user so we use new 
        // and called the database name and the putt the value in string as json format
        const user=new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationExpireAt:Date.now()+(24*60*60*1000)})
        await user.save()

        //jwt token
        console.log(user._id)
        generateTokenAndSetCookie(res,user._id);
        
        await sendVerificationEmail(user.email,verificationToken)

        res.status(201).json({
            success:true,
            message:"User Created succesFully",
            user:{
                ...user._doc,
                password:undefined
            }
        })
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }

}

export const verifyEmail=async(req,res)=>{
    const {code}=req.body;
    try {
        const user=await User.findOne({verificationToken:code,
            verificationExpireAt:{$gt:Date.now()} //$ gt means greater than
        })
        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired verification code"})
        }

        user.isVarified=true;
        user.verificationToken=undefined;
        user.verificationExpireAt=undefined;
        await user.save();

        await sendWelcomeEmail(user.email,user.name);

        res.status(200).json({
            success:true,
            message:"Email verified successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })
    } catch (error) {
         return res.status(500).json({success:false,message:'server Error'})
    }
}

export const logout=async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,message:'logged out succesfully'})
}
export const forgotPassword=async(req,res)=>{
    const {email}=req.body;

    try {
        const user=await User.findOne({email});

        if(!user){
            res.status(400).json({success:false,message:"Invalid User"})
        }

        const resetToken=crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt=Date.now()+1*60*60*1000;
  
        user.resetPasswordToken=resetToken;
        user.resetPasswordExpiresAt=resetTokenExpiresAt
        await user.save();
       
        await sendForgotPassword(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({
            success:true,
            message:"Password reset Link set to your email"
        })
        
    } catch (error) {
        console.log("Error in forgotPassword",Error);
        res.status(400).json({success:false,message:error.message})
        
    }
}

export const resetPassword=async (req,res)=>{
    try {
        const {token}=req.params;
        const {password}=req.body;

        const user=await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()}
        })

        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired reset token"});
        }

        const hashedPassword=await bcryptjs.hash(password,10);
        user.password=hashedPassword;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpiresAt=undefined;

        await user.save();

        sendResetSuccesMessage(user.email);

        res.status(200).json({success:true,message:"password reset succesfully"});
        
    } catch (error) {

        console.log("Ërror in resetPassword",error);
        res.status(400).json({success:false,message:error.message})
        
    }
}

export const checkAuth=async (req,res)=>{

    try {
        const user=await User.findById(req.userId).select("-password");

        if(!user){
            return res.status(400).json({success:false,message:"user not found"});
        }

        res.status(200).json({success:true,user});
        
    } catch (error) {
        console.log("Ërror in checkAuth",error);
        res.status(400).json({success:false,message:error.message})
    }
}