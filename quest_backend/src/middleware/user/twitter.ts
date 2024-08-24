import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../models/user/user"; // Import your User model
import UserDb from "../../models/user/user";
import KolsDB from "../../models/kols/kols";

export const TwitterConnected = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    // If user is authenticated via Passport.js
    const users = req.user as IUser;
    const userId = users._id;
    const role = users.role;

    try {
      // Check if the user exists in MongoDB
      let user;
      if (role === 'user') {
        user = await UserDb.findById(userId);
      } else if (role === 'kol') {
        user = await KolsDB.findById(userId);
      } else {
        return res.status(403).json({
          error: "Forbidden",
          message: "Invalid role",
        });
      }

      // Check if the user has connected their Twitter account
      if (user?.twitterInfo?.twitterId) {
        // User has connected their Twitter account, permit the request
        return res.status(200).json({
          message: "User has already connected their Twitter account",
        });
      } else {
        // If Twitter account is not connected, pass to the next middleware
        return next();
      }
    } catch (error) {
      console.error("Error checking user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // User is not authenticated
    return res.status(401).json({
      error: "Unauthorized",
      message: "You are not logged in",
    });
  }
};
