import express,{Response, Request} from 'express';
import {famTaskComplete,referredByUser,getDomains, getUserById,followUser,unfollowUser,signUpDomain, getAllUser, getFriendsByIds,generateReferralCode, loginDomain, setReferralCode } from '../../controllers/user/user'
import {getUsersByRewardsOrder,getReferrers } from '../../controllers/leaderboard/leaderboard';
import { verifyToken } from '../../middleware/user/verifyToken';
const userRouter = express.Router();

userRouter.post('/follow',followUser);
userRouter.post('/unfollow',unfollowUser);
userRouter.get('/leaderboard/usersBycoins',getUsersByRewardsOrder);
userRouter.get('/leaderboard/referrer',getReferrers);
userRouter.get('/referred',verifyToken,referredByUser);
userRouter.post('/friends',getFriendsByIds);
userRouter.post('/signUpDomain',signUpDomain);
userRouter.post('/loginDomain',loginDomain);
userRouter.get('/generateRefferalCode',verifyToken,generateReferralCode);
userRouter.post('/setRefferalCode',verifyToken,setReferralCode);
userRouter.get('/domains',getDomains);
userRouter.post('/famTaskComplete',verifyToken,famTaskComplete);
userRouter.get('/:id',getUserById);
userRouter.get( '/', getAllUser );

export default userRouter