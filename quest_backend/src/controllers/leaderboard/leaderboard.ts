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
    const users = await User.aggregate([
      {
        $match: {
          domain: { $exists: true, $ne: null } // Ensure the domain field exists and is not null
        }
      },
      {
        $project: {
          displayName: 1, // Include any other fields you want to return
          domain: 1,
          image: 1,
          rewards:1,
          referredUserCount: { $size: { $ifNull: ["$referredUsers", []] } } // Count the number of referred users
        }
      },
      {
        $setWindowFields: {
          sortBy: { referredUserCount: -1 }, // Sort by referredUserCount in descending order
          output: {
            rankByReferredUser: {
              $rank: {} // Assign rank based on referredUserCount
            }
          }
        }
      },
      {
        $sort: { referredUserCount: -1 } // Ensure the final output is sorted by referredUserCount
      }
    ]);
    
    res.send({ success: true, users, message: "Users fetched successfully" });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};
