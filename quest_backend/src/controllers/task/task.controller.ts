import { Request, Response } from "express";
import TaskModel, { TaskOrPoll } from "../../models/task/task.model";
import QuestModel, { Quest } from "../../models/quest/quest.model";
import UserDb, { IUser } from "../../models/user/user";
import { Badge, ReferralDb } from "../../models/other models/models";
import CommunityModel from "../../models/community/community.model";
import mongoose from "mongoose";

const generateReferralCode = async ( randomLength: number ) =>
{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomPart = '';

    for ( let i = 0; i < randomLength; i++ )
    {
        const randomIndex = Math.floor( Math.random() * characters.length );
        randomPart += characters[ randomIndex ];
    }


    const finalReferralCode = randomPart;

    return finalReferralCode;
};


export const taskController = {

    // get all task
    getAllTask: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const tasks = await TaskModel.find();
            res.json( tasks );
        }
        catch ( err )
        {
            res.json( { message: err } );
        }
    },

    // get task by quest id
    getTaskByQuestId: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const { id } = req.params;
            if ( !id )
            {
                res.status( 400 ).json( { message: "Quest ID is required" } );
                return;
            }
            const tasks = await TaskModel.find( { questId: id } );
            if ( tasks.length === 0 )
            {
                res.status( 404 ).json( { message: "No tasks found for this quest" } );
                return;
            }

            res.status( 200 ).json( tasks );
        } catch ( err )
        {
            console.error( "Error fetching tasks by quest ID:", err );
            res.status( 500 ).json( {
                message: "An error occurred while fetching tasks",
                error: err instanceof Error ? err.message : String( err )
            } );
        }
    },

    // get task by creator id
    getTaskByCreatorId: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const { id } = req.params;
            if ( !id )
            {
                res.status( 400 ).json( { message: "Creator ID is required" } );
                return;
            }
            const tasks = await TaskModel.find( { creator: id } );
            if ( tasks.length === 0 )
            {
                res.status( 404 ).json( { message: "No tasks found for this creator" } );
                return;
            }

            res.status( 200 ).json( tasks );
        } catch ( err )
        {
            console.error( "Error fetching tasks by Creator ID:", err );
            res.status( 500 ).json( {
                message: "An error occurred while fetching tasks",
                error: err instanceof Error ? err.message : String( err )
            } );
        }
    },

    addTask: async ( req: Request, res: Response ): Promise<void> =>
    {
        // console.log( req.body );
        try
        {
            const questId = req.body.questId;
            const creator = req.body.creator;
            const userId = req.body.user;
            const new_task: TaskOrPoll = await TaskModel.create( req.body );
            const user = await UserDb.findById( userId );
            const quest = await QuestModel.findById( questId );

            // console.log(quest)
            if ( quest )
            {
                // creatorUser?.tasks?.push( new_task._id );
                user?.createdTasks?.push( new mongoose.Types.ObjectId( new_task._id ) );
                quest?.tasks?.push( new_task._id );
                await quest?.save();
                await user?.save();
                res.status( 200 ).json( { msg: "New Task has been created", new_task: new_task } );
            } else
            {
                res.status( 400 ).json( { message: "Quest not found" } );
            }
        } catch ( error )
        {
            console.log( error );
            res.status( 500 ).json( { msg: "Error creating new  Task", error } );
        }
    },

    connectWallet: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            const { taskId, address } = req.body;
            const task = await TaskModel.findById( taskId );
            if ( !task )
            {
                res.status( 404 ).json( { message: "Task not found" } );
                return;
            }
            // check if address is already present or not
            if ( task?.connectedWallets?.includes( address ) )
            {
                res.status( 400 ).json( {
                    message: "Wallet is already connected to this task"
                } );
                return;
            }
            console.log( "address:-", address );

            task?.connectedWallets?.push( address );
            console.log( "wallect connect succesfuly" );
            await task.save();
            res.status( 200 ).json( { msg: "Wallet connected successfully", task } );
        } catch ( error )
        {
            console.error( error );
            res.status( 500 ).json( { message: "Error connect wallet", error } );
        }
    },

    completeTask: async ( req: Request, res: Response ): Promise<void> =>
    {
        try
        {
            // console.log( req.body );
            const { taskId, userId } = req.body;

            const task = await TaskModel.findById( taskId );
            console.log( 'task at somplete take:-', task );
            if ( !task )
            {
                res.status( 404 ).json( { message: "Task not found" } );
                return;
            }

            if ( task.creator === userId )
            {
                res.status( 201 ).json( { message: "YOU HAVE CREATED THIS TASK" } );
                return;
            }

            const user = await UserDb.findById( userId );
            if ( !user )
            {
                res.status( 404 ).json( { message: "User not found" } );
                return;
            }
            if ( task?.connectedWallets?.length && task.walletsToConnect && task?.connectedWallets?.length !== task.walletsToConnect )
            {
                user.rewards.coins += 10;
                return;
            }

            // Check if the user has already completed this task
            const alreadyCompleted = task.completions?.some(
                ( completion ) => completion.user.toString() === userId
            );

            if ( alreadyCompleted )
            {
                // console.log( "message: Task already completed by this user" );
                res.status( 400 ).json( { message: "Task already completed by this user" } );
                return;
            }

            // Add the completion to the task
            if ( !task.completions )
            {
                task.completions = [];
            }

            task?.completions.push( { user: userId, completedAt: new Date(), submission: req.body.submission, userName: req.body.userName } );

            user.rewards.xp += +( task?.rewards?.xp );
            user.rewards.coins += +( task?.rewards.coins );

            if ( req?.body?.visitLink )
            {
                task?.visitor?.push( req.body.userId );
            }
            else if ( req.body.inviteLink )
            {
                task?.invitee?.push( req.body.userId );
            }

            await task.save();

            // Add the task to the user's completed tasks
            if ( !user.completedTasks )
            {
                user.completedTasks = [];
            }
            user.completedTasks.push( taskId );


              
            await user.save();

            res.status( 200 ).json( { message: "Task completed successfully",coins:task.rewards.coins,xps:task.rewards.xp } );
        } catch ( error )
        {
            console.error( error );
            res.status( 500 ).json( { message: "Error completing task", error } );
        }
    },



    // rewards claim
    claimReward: async ( req: Request, res: Response ): Promise<any> =>
    {
        try
        {
            const { userId, questId } = req.body;

            const quest: Quest | null = await QuestModel.findById( questId );
            const user: IUser | null = await UserDb.findById( userId );

            if ( !quest || !user )
            {
                return res.status( 404 ).json( {
                    message: "Quest or user not found"
                } );
            }

            // Check if the reward has already been claimed by the user
            if ( user.quest.includes( questId ) )
            {
                return res.status( 200 ).json( {
                    message: "Reward already claimed"
                } );
            }

            // Update user's rewards
            quest.rewards.forEach( reward =>
            {
                if ( reward.type === 'xp' )
                {
                    user.rewards.xp += reward.value;
                } else if ( reward.type === 'coin' )
                {
                    user.rewards.coins += reward.value;
                }
            } );

            // Add questId to user's quests
            user.quest.push( questId );

            // Fetch and sort badges
            const badges = await Badge.find();
            const sortedBadges = badges.sort( ( a, b ) => b.level - a.level );

            // Check for new badge
            for ( const badge of sortedBadges )
            {
                // console.log( badge.level, badge.questCriteria, badge.taskCriteria )

                if ( user.quest.length >= badge.questCriteria && user.completedTasks.length >= badge.taskCriteria )
                {
                    user.badges?.push( badge );
                    user.level = badge.level.toString();
                    // console.log("caleed")
                    break; // Exit after assigning the highest achieved badge
                }
            }

            // console.log("user :-", user)
            // Save the updated user
            await user.save();

            const response: any = {
                message: "Reward claimed successfully",
                updatedRewards: user.rewards
            };


            res.status( 200 ).json( response );

        } catch ( error )
        {
            console.error( error );
            res.status( 500 ).json( { message: "Error claiming reward", error } );
        }
    },

    // delete the task
    deleteTask: async ( req: any, res: Response ): Promise<void> =>
    {

        try
        {  
            console.log( "req.user", req.user );
            const {ids} =req.user;
            const taskId = req.params.id;
            console.log( "task id",taskId );

            const task = await TaskModel.findById( taskId );

            if ( !task )
            {
                res.status( 404 ).json( { message: "Task not found" } );
            }
            else if ( task?.creator?.toString() !== ids?.toString() )
            {
                res.status( 403 ).json( {
                    message: "You are not authorized to delete this task"
                } );
            }
            else
            {
                const questId=task.questId;

                const quest = await QuestModel.findById( questId );

                if ( quest )
                {
                    quest.tasks = quest?.tasks?.filter( ( task ) => task.toString() !== taskId );
                    await quest.save();
                }

                const creatorId=  task.creator;

                const creator = await UserDb.findById( creatorId );
                if(creator){
                    creator.createdTasks = creator?.createdTasks?.filter( ( task ) => task.toString() !== taskId );
                    await creator.save();
                }
                
                await TaskModel.findByIdAndDelete( taskId );
                
                res.status( 200 ).json( { message: "Task deleted successfully" } );
            }
        } catch ( error )
        {
            console.error( error );
            res.status( 500 ).json( { message: "Error deleting task", error } );
        }
    },



    referralGenerate: async ( req: Request, res: Response ): Promise<void> =>
    {
        const { userId, questId, taskId, expireDate } = req.body;
        // console.log( "first", req.body );
        if ( !userId )
        {
            res.status( 500 ).json( { message: "User Not Found Please Login" } );
            return;
        }
        try
        {
            const randomLength = 10;
            let referral: string;
            let referralCheck: any;
            const community = await CommunityModel.findOne( { quests: questId } );
            const communityInfo = community?._id;

            // Generate and check the referral code until a unique one is found
            do
            {
                referral = await generateReferralCode( randomLength );
                referralCheck = await ReferralDb.findOne( { referralCode: referral } );
            } while ( referralCheck );

            // Save the new referral code 
            const expiresAt = new Date();
            expiresAt.setDate( expiresAt.getDate() + expireDate ); // Set expiration date

            // Save the new referral code with the expiration date
            const user = new ReferralDb( {
                referralCode: referral,
                userInfo: userId,
                questInfo: questId,
                taskInfo: taskId,
                communityInfo,
                expiresAt
            } );

            await user.save();

            // console.log( referral );
            res.status( 201 ).send( referral );

        } catch ( error )
        {
            console.error( error );
            res.status( 500 ).json( { message: "Error generating referral code", error } );
        }
    }














    //  DON'T TOUCH BELOW CODE



    // these are just for now, if not needed and we dont required i will remove them , please don't touch them
    // // visit link task
    // visitLink: async ( req: Request, res: Response ) :Promise< void> =>
    // {
    //     console.log(req.body)
    //     try
    //     {
    //         const questId = req.body.creator;

    //         const visit: TaskOrPoll = await TaskModel.create( req.body );

    //         const quest = await QuestModel.findById( questId );
    //         // console.log(quest)
    //         if ( quest )
    //         {
    //             quest?.tasks?.push( visit._id );
    //             await quest?.save();
    //         }else{
    //             res.status( 400 ).json( { message: "Quest not found" } );
    //         }
    //         res.status( 200 ).json( { msg:"New Visit Link Task has been created", newVisitTask:visit} );
    //         } catch (error) {
    //         console.log( error )
    //         res.status( 500 ).json( { msg: "Error creating new Visit Link Task", error } );
    //     }
    // },

    // // create a poll
    // createPoll: async ( req: Request, res: Response ): Promise<void> =>
    // {
    //     console.log( req.body )
    //     try
    //     {
    //         const questId = req.body.creator;
    //         const poll: TaskOrPoll = await TaskModel.create( req.body );
    //         const quest = await QuestModel.findById( questId );
    //         if ( quest )
    //         {
    //             quest?.tasks?.push( poll._id );
    //             await quest?.save();
    //         }
    //         else
    //         {
    //             res.status( 400 ).json( { message: "Quest not found" } );
    //         }
    //         res.status( 200 ).json( {
    //             msg: "New Poll Task has been created", "new Poll Task": poll
    //         } );
    //     } catch ( error )
    //     {
    //         console.log( error )
    //         res.status( 500 ).json( {
    //             msg: "Error creating new Poll Task", error
    //         } );
    //     }
    // },

    // // create a quiz
    // createQuiz: async ( req: Request, res: Response ): Promise<void> =>
    // {
    //     console.log( req.body )
    //     try
    //     {
    //         const questId = req.body.creator;
    //         const quiz: TaskOrPoll = await TaskModel.create( req.body );
    //         const quest = await QuestModel.findById( questId );
    //         if ( quest )
    //         {
    //             quest?.tasks?.push( quiz._id );
    //             await quest?.save();
    //         }
    //         else
    //         {
    //             res.status( 400 ).json( { message: "Quest not found" } );
    //         }
    //         res.status( 200 ).json( {
    //             msg: "New Quiz Task has been created", "new Quiz Task": quiz
    //         } );
    //     } catch ( error )
    //     {
    //         console.log( error )
    //         res.status( 500 ).json( {
    //             msg: "Error creating new Quiz Task", error
    //         } );
    //     }
    // },

    // // create a invite to n number of other members
    // createInvite: async ( req: Request, res: Response ): Promise<void> =>
    // {
    //     console.log( req.body )
    //     try
    //     {
    //         const questId = req.body.creator;
    //         const invite: TaskOrPoll = await TaskModel.create( req.body );
    //         const quest = await QuestModel.findById( questId );
    //         if ( quest )
    //         {
    //             quest?.tasks?.push( invite._id );
    //             await quest?.save();
    //         }
    //         else
    //         {
    //             res.status( 400 ).json( { message: "Quest not found" } );
    //         }
    //         res.status( 200 ).json( {
    //             msg: "New Invite Task has been created", "new Invite Task": invite
    //         } );
    //     } catch ( error )
    //     {
    //         console.log( error )
    //         res.status( 500 ).json( {
    //             msg: "Error creating new Invite Task", error
    //         } );
    //     }
    // }





};