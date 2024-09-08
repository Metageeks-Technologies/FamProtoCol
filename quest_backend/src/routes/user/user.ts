import express,{Response, Request} from 'express';
import {getDomains, getUserById,followUser,unfollowUser,createUserByDomain, getAllUser, getFriendsByIds,generateReferralCode } from '../../controllers/user/user'
import  getUsersByCoinsOrder  from '../../controllers/leaderboard/leaderboard';
import { verifyToken } from '../../middleware/user/verifyToken';
const userRouter = express.Router();

userRouter.post('/follow',followUser);
userRouter.post('/unfollow',unfollowUser);
userRouter.get('/leaderboard/usersBycoins',getUsersByCoinsOrder);
userRouter.post('/friends',getFriendsByIds);
userRouter.post('/domain',createUserByDomain);
userRouter.get('/generateRefferalCode',verifyToken,generateReferralCode);
userRouter.get('/domains',getDomains);
userRouter.get('/:id',getUserById);
userRouter.get( '/', getAllUser )

export default userRouter