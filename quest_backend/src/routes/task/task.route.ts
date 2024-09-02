import express from "express";
import { taskController } from "../../controllers/task/task.controller";
import { createTaskOptions, getTaskOptions, updateTaskOptions } from "../../controllers/task/taskOption.controller";
import { RefrralMiddleaware } from "../../middleware/user/referralAuthorize";


const taskRouter = express.Router();

// get the tasksoptins and categories
taskRouter.get("/task-options", getTaskOptions);

// create the taskoptions and categories
taskRouter.post( "/task-options", createTaskOptions );

// update the tasksoptions and categories
taskRouter.post( "/update-task-options", updateTaskOptions );

taskRouter.post('/get/referral',taskController.referralGenerate);



// get all tasks
//in this route you need to apply middleware, only admin can get all tasks
// taskRouter.get( "/", taskController.getAllTask );

// get task by quest id
taskRouter.get( "/:id", taskController.getTaskByQuestId );
    
// get task by creator (kol id)
taskRouter.get( "/kol/:id", taskController.getTaskByCreatorId );

// create task
taskRouter.post( "/", taskController.addTask );

taskRouter.get('/',taskController.getAllTask)

// connect the wallets
taskRouter.post( "/connect-wallet", taskController.connectWallet );

// complete task
taskRouter.post( "/complete", taskController.completeTask );

// claim reward
taskRouter.post( "/claim", taskController.claimReward );

// delete the task by its id
taskRouter.delete( "/:id", taskController.deleteTask );

// // create the task
// taskRouter.post( '/visit', taskController.visitLink )

// // create a poll
// taskRouter.post( '/poll', taskController.createPoll )

// // create a invite
// taskRouter.post( '/invite', taskController.createInvite )


export default taskRouter;