import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
  
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  
    // Check if cookie was set successfully (for debugging)
    console.log("Cookie set:", res.getHeader('Set-Cookie'));
  
    return token;
  };