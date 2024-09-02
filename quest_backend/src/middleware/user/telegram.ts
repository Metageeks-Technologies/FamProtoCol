import { NextFunction, Request, Response } from "express";
import KolsDB from "../../models/kols/kols";
import UserDb from "../../models/user/user";
 

export const checkTelegramId = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {

    try {
      const { id: telegramId } = req.body as { [key: string]: string };
  
      // Check if the Telegram ID is already in KolsDB or UserDb
      const regularUser = await UserDb.findOne({ 'teleInfo.telegramId': telegramId });
  
      if (regularUser) {
        return res.status(403).send('Authentication failed: Telegram ID already exists.');
      }
  
      // If the Telegram ID is not found, proceed to the next middleware
      next();
    } catch (error) {
      console.error("Error checking Telegram ID:", error);
      return res.status(500).send("Internal server error.");
    }
} else {
    // User is not authenticated
    return res.status(401).send('Please log in');
  }
  };