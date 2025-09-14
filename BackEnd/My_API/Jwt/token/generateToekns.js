import dotenv from "dotenv";
dotenv.config(); 

import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined in .env");
  }

  return jwt.sign(
    { sub: user.sub, name: user.name, phone: user.phone_number }, 
    process.env.JWT_ACCESS_SECRET,                                
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }            
  );
}

export function generateRefreshToken(user) {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in .env");
  }

  return jwt.sign(
    { sub: user.id },                          
    process.env.JWT_REFRESH_SECRET,          
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN } 
  );
}
