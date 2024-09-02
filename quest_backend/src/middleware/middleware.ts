import { NextFunction, Request, Response } from "express";
import { ReferralDb } from "../models/other models/models";
import TaskModel from "../models/task/task.model";
import CommunityModel from "../models/community/community.model";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserDb, { IUser } from "../models/user/user";
import KolsDB from "../models/kols/kols";
dotenv.config;

export interface jwtUser {
  ids: string;
  phone_number: string;
}

const secretKey = process.env.JWT_SECRET as string;

interface JwtPayload {
  id: string;
}

const authAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authAdmin;


export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("verifying token",req);
  try {
    const token =
      req.cookies.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .send({
          success: false,
          message: "User not authenticated.Login to continue",
        });
    }
    const decoded = jwt.verify(token, secretKey) as jwtUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ success: false, message: "Invalid Token" });
  }
};

export const RefrralMiddleaware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const communityId = req.params.id;

  const { referral, userId } = req.body;
  if (!referral) {
    return res
      .status(400)
      .json({ message: "Invalid Call. Please Fill The referral" });
  }

  try {
    const referralCheck = await ReferralDb.findOne({ referralCode: referral });
    if (!referralCheck) {
      return res.status(404).json({ message: "Invalid Referral" });
    }

    const community = await CommunityModel.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    // console.log("ds",community._id.toString() !== referralCheck.communityInfo.toString())

    // Check if the community in the referral matches the community in the request
    if (community._id.toString() !== referralCheck.communityInfo.toString()) {
      return res.status(400).json({ message: "Wrong community" });
    }

    const taskId = referralCheck.taskInfo;

    if (!taskId) {
      return res
        .status(400)
        .json({ message: "Task information is missing from referral" });
    }
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const userIdFromReferral = referralCheck.userInfo;
    if (!userIdFromReferral) {
      return res
        .status(400)
        .json({ message: "User information is missing from referral" });
    }
    const user = await UserDb.findById(userIdFromReferral);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("first",user)
    // Check if the user has already completed this task
    const alreadyCompleted = task.completions?.some(
      (completion) =>
        completion.user.toString() === userIdFromReferral.toString()
    );

    if (alreadyCompleted) {
      return res
        .status(400)
        .json({ message: "Task already completed by this user" });
    }

    // Add the completion to the task
    if (!task.completions) {
      task.completions = [];
    }

    task.completions.push({
      user: new mongoose.Types.ObjectId(userIdFromReferral), // Convert to ObjectId
      completedAt: new Date(),
      submission: userId,
      userName: user.displayName,
    });

    await task.save();

    // Add the task to the user's completed tasks
    if (!user.completedTasks) {
      user.completedTasks = [];
    }

    user.completedTasks.push(new mongoose.Types.ObjectId(taskId)); // Convert to ObjectId
    await user.save();
    // console.log(communityId,referral,userId);

    return next();
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    // If user is authenticated via Passport.js

    const users = req.user as IUser;
    const userId = users._id;
    const role = users.role;
    try {
      // Check if the user exists in  the corresponding MongoDB collection based on the role

      let user;
      if (role === "user") {
        user = await UserDb.findById(userId);
      } else if (role === "kol") {
        user = await KolsDB.findById(userId);
      } else {
        return res.status(403).json({
          error: "Forbidden",
          message: "Invalid role",
        });
      }

      if (user) {
        return next();
      } else {
        // User not found in the database (possibly deleted or invalid)

        return res.status(401).json({
          error: "Unauthorized",
          message: "User not found or invalid",
        });
      }
    } catch (error) {
      console.error("Error checking user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: "You are not logged in" });
  }
};
