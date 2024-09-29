import { Request, Response } from 'express';
import User from '../../models/user/user';

export const getUsersByRewardsOrder = async (req:Request, res:Response) => {
  try {
    const users = await User.find().sort({ 'rewards.xp': -1, 'rewards.coins': -1 }).exec();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const getReferrers = async (req: Request, res: Response) => {
  try {
    let users = await User.aggregate([
      {
        $match: {
          domain: { $exists: true, $ne: null }, // Ensure the domain field exists and is not null
        },
      },
      {
        $project: {
          displayName: 1, // Include any other fields you want to return
          domain: 1,
          image: 1,
          rewards: 1,
          referredUserCount: { $size: { $ifNull: ["$referredUsers", []] } }, // Count the number of referred users
          createdAt: 1, // Include creation date to break ties
        },
      },
      {
        $sort: {
          referredUserCount: -1, // Sort by referredUserCount in descending order
          createdAt: 1,          // Sort by createdAt in ascending order to break ties
        },
      },
    ]);

    // Assign unique ranks manually
    users = users.map((user, index) => ({
      ...user,
      rankByReferredUser: index + 1, // Assign unique rank based on index
    }));

    res.send({ success: true, users, message: "Users fetched successfully" });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};








