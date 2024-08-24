import express from 'express';
import { login, signup } from '../../controllers/admin/adminControllers';
import { getCommunityData,addCommunityData,updateById,deleteById } from '../../controllers/admin/communityData';
import { addFeed, deleteFeed, updateFeed } from '../../controllers/feeds/feed';
import {getBadges, addBadge,updateBadgeById,deleteBadgeById} from '../../controllers/admin/badgeController';
const router = express.Router();

// Register admin
router.post('/signup',signup);
router.post('/login',login);
//metadata
router.get('/getCommunityData',getCommunityData);
router.post('/addCommunityData',addCommunityData);
router.put('/metadata/:type/:id', updateById);
router.delete('/metadata/:type/:id', deleteById);
// feed
router.post('/add-feed',addFeed);
router.patch( '/update-feed/:id', updateFeed );
router.delete( '/delete-feed/:id  ', deleteFeed );
//badge
router.get('/badges', getBadges);
router.post('/badges', addBadge);
router.put('/badges/:id', updateBadgeById);
router.delete('/badges/:id', deleteBadgeById);



export default router;