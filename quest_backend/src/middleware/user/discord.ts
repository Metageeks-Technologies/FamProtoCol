import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../../models/user/user";
import UserDb from "../../models/user/user";
import KolsDB from "../../models/kols/kols";

// Middleware to check if the user has connected their Discord account
export const DiscordConnected = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    // If user is authenticated via Passport.js
    const users = req.user as IUser;
    const userId = users._id;
    const role = users.role;

    let user;
    try {
      // Check if the user exists in MongoDB
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

      // Check if the user has connected their Discord account
      if (user?.discordInfo?.discordId) {
        // User has connected their Discord account, permit the request
        return res.status(200).send('User is already registered');
      } else {
        // If Discord account is not connected, pass to the next middleware
        return next();
      }
    } catch (error) {
      console.error('Error checking user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // User is not authenticated
    return res.status(401).send('Please log in');
  }
};
