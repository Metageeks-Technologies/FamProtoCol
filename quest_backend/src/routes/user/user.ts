import express,{Response, Request} from 'express';
import { getUserById,followUser,unfollowUser,createUserByDomain, getAllUser, getFriendsByIds } from '../../controllers/user/user'
import  getUsersByCoinsOrder  from '../../controllers/leaderboard/leaderboard';
const userRouter = express.Router();

userRouter.get('/:id',getUserById);
userRouter.post('/follow',followUser);
userRouter.post('/unfollow',unfollowUser);
userRouter.get('/leaderboard/usersBycoins',getUsersByCoinsOrder);
userRouter.get( '/', getAllUser )
// to find the friends complete information
userRouter.post('/friends',getFriendsByIds);
userRouter.post('/domain',createUserByDomain);

export default userRouter