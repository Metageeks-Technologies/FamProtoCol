import { Request, Response } from 'express';
import User from '../../models/user/user';

const getUsersByRewardsOrder = async (req:Request, res:Response) => {
  try {
    const users = await User.find().sort({ 'rewards.xp': -1, 'rewards.coins': -1 }).exec();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export default  getUsersByRewardsOrder;
