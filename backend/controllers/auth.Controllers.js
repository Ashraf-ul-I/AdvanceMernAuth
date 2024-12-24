import { User } from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const login=async (req,res)=>{
    res.send('Log In route');
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
        generateTokenAndSetCookie(res,user._id);

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

export const logout=async (req,res)=>{
    res.send('Log out route');
}