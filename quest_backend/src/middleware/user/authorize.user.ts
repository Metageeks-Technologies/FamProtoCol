import { Request, Response, NextFunction } from "express";
import UserDb, { IUser } from "../../models/user/user";
import KolsDB from "../../models/kols/kols";

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

    // User is not authenticated
    
    return res
      .status(401)
      .json({ error: "Unauthorized", message: "You are not logged in" });
  }
};
