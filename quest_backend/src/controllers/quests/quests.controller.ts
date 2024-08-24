import { Request, Response } from "express";
import QuestModel, { Quest } from "../../models/quest/quest.model";
import CommunityModel from "../../models/community/community.model";
import UserDb from "../../models/user/user";


export const questController = {

    // create a quest
  createQuest: async (req: Request, res: Response) => {
    // console.log("req form qust controlelr:0", req.body);
    try {
        const { community, creator } = req.body;

        // Create a new quest
        const newQuest: Quest = await QuestModel.create(req.body);

        // Verify if the community exists
        const currentCommunity = await CommunityModel.findById( community );
        const creatorUser = await UserDb.findById( creator );
        if (!currentCommunity) {
            res.status(400).json({ message: "Community not found" });
            return; // Stop further execution
        }

        // Update the community with the new quest ID
        currentCommunity?.quests?.push(newQuest._id);
        creatorUser?.createdQuests?.push( newQuest?._id );
        
        await currentCommunity.save();
        await creatorUser?.save();
        // Send success response
        res.status(201).json({ newQuest: newQuest, msg: "New Quest Created successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error creating quest", error: error });
    }
},


    //  get all quests
    getAllQuests: async ( req: Request, res: Response ) =>
    {
        try
        {
            const allQuests: Quest[] = await QuestModel.find();
            res.status( 200 ).json( {
                allQuests: allQuests, msg:
                    "All Quests retrieved successfully"
            } );
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error retrieving all quests", error:
                    error
            } );
        }
    },

    // Get a specific quest by ID
    getQuestById: async ( req: Request, res: Response ) =>
    {
        try
        {
            const quest: Quest | null = await QuestModel.findById( req.params.id );
            res.status( 200 ).json( {
                quest: quest, msg: "Quest retrieved successfully"
            } );
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error retrieving quest", error: error
            } );
        }
    },

    
    
     // complete quest detail of several ids (bulk)

    getQuestsByIds: async (req: Request, res: Response): Promise<void> => {
    try {
        const questIds = req.body.questIds;
        
        if (!Array.isArray(questIds)) {
            res.status(400).json({ message: 'Invalid input: quest must be an array' });
            return;
        }

        const quests = await QuestModel.find({ _id: { $in: questIds } });
        
        res.status(200).json({
            message: "Communities fetched successfully",
            quests
        });
    } catch (error) {
        console.error('Error in getQuestsByIds:', error);
        res.status(500).json({
            message: 'Internal server error while fetching quests'
        });
    }
},

    // update a quest
    updateQuest: async ( req: Request, res: Response ) =>
    {
        try
        {
            const updatedQuest: Quest | null = await QuestModel.findByIdAndUpdate( req.params.id, req.body
                , { new: true } );
            res.status( 200 ).json( {
                updatedQuest: updatedQuest, msg: "Quest updated successfully"
            } );
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error updating quest", error: error
            } );
        }
    },

    // delete the quest
    deleteQuest: async ( req: Request, res: Response ) =>
    {
        try
        {
            const deletedQuest: Quest | null = await QuestModel.findByIdAndDelete( req.params.id );
            res.status( 200 ).json( {
                deletedQuest: deletedQuest, msg: "Quest deleted successfully"
            } );
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error deleting quest", error: error
            } );
        }
    },

    // Get quests by type
    getQuestsByType: async ( req: Request, res: Response ) =>
    {
        try
        {
            const quests: Quest[] = await QuestModel.find( { type: req.params.type } );
            res.status( 200 ).json( {
                quests: quests, msg: "Quests retrieved successfully"
                } );
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error retrieving quests", error: error
            } );
        }
    },

    // get the quest by status
    getQuestsByStatus: async ( req: Request, res: Response ) =>
    {
        try {
            const quests: Quest[] = await QuestModel.find( { status: req.params.status } );
            res.status( 200 ).json( {
                quests: quests, msg: "Quests retrieved successfully"
            } );
            
        } catch ( error )
        {
            res.status( 500 ).json( {
                msg: "Error retrieving quests", error: error
            } );
        }
    },
    
    // update the quest status
    updateQuestStatus: async ( req: Request, res: Response ) =>
    {
        try {
            const quest: Quest | null = await QuestModel.findOneAndUpdate( {
                _id: req.params.id
            } );
            res.status( 200 ).json( {
                quest: quest, msg: "Quest updated successfully"
            } );
        } catch (error) {
            res.status( 500 ).json( {
                msg: "Error updating quest", error: error
            } );
        }
        
    }    

}