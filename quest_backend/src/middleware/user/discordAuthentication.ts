import { NextFunction, Request, Response } from 'express';

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
  }
  res.status(200).json({ success: false, message: 'User session expired.Please Login' });
};

