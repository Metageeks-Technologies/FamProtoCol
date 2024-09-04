import express from "express";
import { questController } from "../../controllers/quests/quests.controller";

const questsRouter = express.Router();



// create a quest
questsRouter.post( "/", questController.createQuest );

// get all quests
questsRouter.get( "/", questController.getAllQuests );

// get a quest by id
questsRouter.get( "/:id", questController.getQuestById );

// get quests by ids
questsRouter.post( "/getByIds", questController.getQuestsByIds );

// update a quest by id
questsRouter.put( "/:id", questController.updateQuest );
 
// delete the quest
questsRouter.delete( "/:id", questController.deleteQuest );

// get quests by type
questsRouter.get( "/type/:type", questController.getQuestsByType );

// get the quests by status
questsRouter.get( "/status/:id", questController.getQuestsByStatus );

// update the quest status
questsRouter.put( "/status/:id", questController.updateQuestStatus );


export default questsRouter;



