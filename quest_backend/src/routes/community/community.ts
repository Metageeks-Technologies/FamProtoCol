import express  from "express"
import { CommunityController } from "../../controllers/community/community.controller";
import { RefrralMiddleaware } from "../../middleware/user/referralAuthorize";

const communityRoute = express.Router();


// create community
communityRoute.post( '/', CommunityController.createCommunity );
communityRoute.get( '/', CommunityController.getAllCommunities );
communityRoute.post( '/get', CommunityController.getFilterCommunity );
communityRoute.get( '/get', CommunityController.getallFilter );
communityRoute.post('/getByIds', CommunityController.getCommunitiesByIds);
communityRoute.get( '/ecosystem/:ecosystem', CommunityController.getCommunitiesByEcosystem );
communityRoute.get( '/category/:category', CommunityController.getCommunitiesByCategory );
communityRoute.post( '/joincommunity/:id', CommunityController.joinCommunity );
communityRoute.post('/get/joinCommunities/:id',RefrralMiddleaware,CommunityController.joinCommunity);
communityRoute.post( '/leavecommunity/:id', CommunityController.leaveCommunity );
communityRoute.put( '/:id', CommunityController.updateCommunity );
communityRoute.get( '/:id', CommunityController.getCommunityById );
communityRoute.delete( '/:id', CommunityController.deleteCommunity );


export default communityRoute;


