import express,{Response, Request} from 'express';
import { getUserById,followUser,unfollowUser,createUserByDomain, getAllUser, getFriendsByIds,updateUser, getUserProfile } from '../../controllers/user/user'
import  getUsersByCoinsOrder  from '../../controllers/leaderboard/leaderboard';
import { verifyToken } from '../../middleware/middleware';
const userRouter = express.Router();

userRouter.post('/follow',followUser);
userRouter.post('/unfollow',unfollowUser);
userRouter.get('/leaderboard/usersBycoins',getUsersByCoinsOrder);
userRouter.get( '/', getAllUser )
userRouter.post('/friends',getFriendsByIds);
userRouter.post('/domain',createUserByDomain);
userRouter.get("/profile", verifyToken, getUserProfile);
userRouter.put("/profile/update", verifyToken, updateUser);
userRouter.get('/:id',getUserById);

export default userRouter