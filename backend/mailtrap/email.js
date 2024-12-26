import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTamplates.js";
import {  mailtrapEmail, sender } from "./mailtrap.config.js";

export const sendVerificationEmail=async (email,verificationToken)=>{
    const recipient=[{email}];
    try {
        const response=await mailtrapEmail.send({
            from:sender,
            to:recipient,
            subject:"Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification"
        }) 
        console.log("Email sent sucessfully",response)
    } catch (error) {
        console.log(`Error sending Verification `,error);
        throw new Error(`Error sending verification Email:${error}`)

    }
}

export const sendWelcomeEmail=async (email,name)=>{
    const recipient=[{email}];

    try {
        const response=await mailtrapEmail.send({
            from:sender,
            to:recipient,
            subject:"Password Reset Link",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification"
        }) 

    console.log("Email sent sucessfully",response)
} catch (error) {
    console.log(`Error sending Verification `,error);
    throw new Error(`Error sending verification Email:${error}`)

}

}

export const sendForgotPassword=async (email,resetURL)=>{
    const recipient=[{email}];

    try {
       const response= await mailtrapEmail.send({
        from:sender,
        to:recipient,
        subject:"Reset Your Password",
        html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
        category:"Password Reset"
              
        
    })
    console.log("Email sent sucessfully",response)
} catch (error) {
    console.log(`Error sending Verification `,error);
    throw new Error(`Error sending verification Email:${error}`)

}

}
export const sendResetSuccesMessage=async (email)=>{
    const recipient=[{email}];

    try {
       const response= await mailtrapEmail.send({
        from:sender,
        to:recipient,
        subject:"Reset Your Password",
        html:PASSWORD_RESET_SUCCESS_TEMPLATE,
        category:"Password Success"
              
        
    })
    console.log("Password reset Email sent sucessfully",response)
} catch (error) {
    console.log(`Password reset Error sending Verification `,error);
    throw new Error(`Password reset Error sending verification Email:${error}`)

}
}