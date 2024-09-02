import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config

export interface jwtUser{
  ids:string,
  phone_number:string,
}

const secretKey = process.env.JWT_SECRET as string;

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // console.log("verifying token",req);
  try {
  const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
     return res.status(401).send({success: false, message: "User not authenticated.Login to continue"});
  }
    const decoded = jwt.verify(token, secretKey) as jwtUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({success: false, message: "Invalid Token"});
  }
};
