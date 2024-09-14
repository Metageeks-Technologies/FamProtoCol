import { Request, Response } from 'express';
import CommunityModel, { Community } from '../../models/community/community.model';
import UserDb from '../../models/user/user';
import { sendMessage } from '../../controllers/telegram/telegram';
import { sendDiscord } from '../discord/discord';

export const CommunityController = {

    // create a community
    createCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const creator = req.body.creator;
            const newCommunity: Community = await CommunityModel.create( req.body );
            const creatorUser = await UserDb.findById( creator );
            //  console.log(quest) 

            if ( newCommunity )
            {
                creatorUser?.createdCommunities?.push( newCommunity?._id );
                const savedUser = await creatorUser?.save();
                if( savedUser ){
                    const chat_id=process.env.FAMPROTOCOL_TELE_GROUP__ID as string;
                    const discord_chat_id=process.env.FAMPROTOCOL_dISCORD_ID as string;

                    const messageText=`🎉 New Community Created! 🎉\n\n` +
                    `🌟 ${newCommunity?.title}\n\n` +
                    `👥 ${newCommunity?.description}\n\n\n`+
                    ` join the Community!\n\n` ;

                    await sendMessage(chat_id, messageText);
                    await sendDiscord( discord_chat_id, messageText );
                }
                res.status( 200 ).json( { newCommunity: newCommunity, msg: "Community Created Successfully" } );
            } else
            {
              res.status( 400 ).json( { message: "Error in creating the Community" } );
            }
        } catch ( error )
        {
            res.status( 400 ).json( { message: 'Failed to create the Community', error } );
        }
    },
    // get all communities
    getAllCommunities: async ( req: Request, res: Response ): Promise<void> =>
    {
        const page = parseInt( req.query.page as string ) || 1;
        const limit = parseInt( req.query.limit as string ) || Infinity;
        const skip = ( page - 1 ) * limit;
        try
        {
            const communities: Community[] = await CommunityModel.find().skip( skip ).limit( limit );
            const totalCommunities = await CommunityModel.countDocuments();
            const totalPages = Math.ceil( totalCommunities / limit );
            res.status( 200 ).json( {
                communities: communities, totalPages,
                msg: "Fetched Communities successfully"
            } );
        } catch ( error )
        {
            res.status( 400 ).json( { message: 'failed to fetch the communities', error } );
        }
    },
    getallFilter: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const communities: Community[] = await CommunityModel.find();
            res.status( 200 ).json( {
                communities: communities,
                msg: "Fetched Communities successfully"
            } );
        } catch ( error )
        {
            res.status( 400 ).json( { message: 'failed to fetch the communities', error } );
        }
    },

    getFilterCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const { search, ecosystem, category } = req.body;
            const page = Math.max( 1, parseInt( req.query.page as string ) || 1 );
            const limit = Math.max( 1, Math.min( 100, parseInt( req.query.limit as string ) || 10 ) );
            const skip = ( page - 1 ) * limit;

            // Construct query object based on provided filters
            const query: any = {};

            if ( search && search.trim() )
            {
                query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
            }

            if ( ecosystem && ecosystem.length > 0 && ecosystem[ 0 ].trim() )
            {
                query.ecosystem = { $in: Array.isArray( ecosystem ) ? ecosystem : [ ecosystem ] };
            }

            if ( category && category.length > 0 && category[ 0 ].trim() )
            {
                query.category = { $in: Array.isArray( category ) ? category : [ category ] };
            }

            const [ communities, totalCommunities ] = await Promise.all( [
                CommunityModel.find( query ).sort({ createdAt: -1 }).skip( skip ).limit( limit ),
                CommunityModel.countDocuments( query )
            ] );

            const totalPages = Math.ceil( totalCommunities / limit );

            res.status( 200 ).json( {
                communities: communities,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalCommunities,
                    itemsPerPage: limit,
                },
                msg: "Fetched Communities successfully"
            } );
        } catch ( error )
        {
            res.status( 400 ).json( {
                message: 'Failed to fetch communities',
                error,
            } );
        }
    },
    // Get a specific community by ID
    getCommunityById: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const community: Community | null = await CommunityModel.findById( req.params.id );
            res.status( 200 ).json( { community: community, msg: `Community Fetched successfully` } );
        }
        catch ( error )
        {
            res.status( 400 ).json( {
                message: 'failed to fetch the community', error
            } );
        }
    },

    // complete community detail of several ids (bulk)

    getCommunitiesByIds: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const communityIds = req.body.communityIds;
            console.log("communiyt ids:", communityIds );

            if ( !Array.isArray( communityIds ) )
            {
                res.status( 400 ).json( { message: 'Invalid input: communityIds must be an array' } );
                return;
            }

            const communities = await CommunityModel.find( { _id: { $in: communityIds } } ).sort( { createdAt: -1 } );
            console.log("communities:", communities );
            res.status( 200 ).json( {
                message: "Communities fetched successfully",
                communities
            } );
        } catch ( error )
        {
            console.error( 'Error in getCommunitiesByIds:', error );
            res.status( 500 ).json( {
                message: 'Internal server error while fetching communities'
            } );
        }
    },

    // update a community
    updateCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const community: Community | null = await CommunityModel.findByIdAndUpdate( req.params.id, req.body,
                { new: true } );
            res.status( 200 ).json( community );

        } catch ( error )
        {
            res.status( 400 ).json( {
                message: 'failed to update the community', error
            } );
        }
    },

    // delete the community
    deleteCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            console.log(req.params)
            const communityId = req.params.id;
            console.log("community",communityId)
            const community = await CommunityModel.findByIdAndDelete( communityId );
            if ( !community ) res.status( 404 ).json( { message: 'Community not found' } );
            else res.status( 200 ).json( { message: 'Community deleted successfully' } );
        } catch ( error )
        { 
            console.error( 'Error in deleteCommunity:', error );
            res.status( 500 ).json( {
                message: 'Internal server error while deleting community'
            } );
        }
    },

    // Get communities by ecosystem
    getCommunitiesByEcosystem: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            let communities: Community[] = [];
            if ( req.params.ecosystem )
            {
                communities = await CommunityModel.find( {
                    ecosystem: req.params.ecosystem
                } );

            } else
            {
                communities = await CommunityModel.find();
            }
            res.status( 200 ).json( communities );
        } catch ( error )
        {
            res.status( 400 ).json( {
                message: 'Failed to fetch the community by ecosystem',
                error
            } );
        }
    },

    //Get communities by category
    getCommunitiesByCategory: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            let communities: Community[] = [];
            if ( req.params.category )
            {
                communities = await CommunityModel.find( {
                    category: req.params.category
                } );
            } else
            {
                communities = await CommunityModel.find();
            }
            res.status( 200 ).json( communities );
        } catch ( error )
        {
            res.status( 400 ).json( {
                message: 'Failed to fetch the community by category', error
            } );
        }
    },

    // join the community by member 
    joinCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const communityId = req.params.id;
            const memberId = req.body.memberId;
            // console.log( "firsdsdst", memberId, communityId );
            if ( !communityId || !memberId )
            {
                res.status( 400 ).json( { message: 'Invalid community ID or member ID' } );
                return;
            }
            const community = await CommunityModel.findById( communityId );

            if ( memberId == community?.creator )
            {
                res.status( 400 ).json( {
                    message: 'You cannot join your own community'
                } );
                return;
            }

            const updatedCommunity = await CommunityModel.findOneAndUpdate(
                { _id: communityId, members: { $ne: memberId } },
                { $addToSet: { members: memberId } },
                { new: true, runValidators: true }
            );

            // console.log( updatedCommunity );
            if ( !updatedCommunity )
            {
                res.status( 404 ).json( { message: 'Community not found or member already added' } );
                return;
            }

            // Update the user's communities array
            const updatedUser = await UserDb.findByIdAndUpdate(
                memberId,
                { $addToSet: { community: communityId } },
                { new: true, runValidators: true }
            );

            if ( !updatedUser )
            {
                res.status( 404 ).json( { message: 'User not found' } );
                return;
            }

            res.status( 200 ).json( {
                message: "Member added to community successfully",
                updatedCommunity,
                updatedUser
            } );

        } catch ( error )
        {
            console.error( 'Error in joinCommunity:', error );
            res.status( 500 ).json( {
                message: 'Internal server error while joining community'
            } );
        }
    },

    // member leave the community
    leaveCommunity: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const communityId = req.params.id;
            const memberId = req.body.memberId;

            if ( !communityId || !memberId )
            {
                res.status( 400 ).json( { message: 'Invalid community ID or member ID' } );
                return;
            }

            // Remove member from community
            const updatedCommunity = await CommunityModel.findOneAndUpdate(
                { _id: communityId, members: memberId },
                { $pull: { members: memberId } },
                { new: true, runValidators: true }
            );

            if ( !updatedCommunity )
            {
                res.status( 404 ).json( { message: 'Community not found or member not in community' } );
                return;
            }

            // Remove community from user's communities array
            const updatedUser = await UserDb.findByIdAndUpdate(
                memberId,
                { $pull: { communities: communityId } },
                { new: true, runValidators: true }
            );

            if ( !updatedUser )
            {
                res.status( 404 ).json( { message: 'User not found' } );
                return;
            }

            res.status( 200 ).json( {
                message: 'Member removed successfully from community and community removed from user',
                updatedCommunity,
                updatedUser
            } );
        } catch ( error )
        {
            console.error( 'Error in leaveCommunity:', error );
            res.status( 500 ).json( {
                message: 'Internal server error while leaving community'
            } );
        }
    },








}









