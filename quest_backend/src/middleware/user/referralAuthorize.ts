import { NextFunction, Request, Response } from "express";
import { IReferral, ReferralDb } from "../../models/other models/models";
import TaskModel from "../../models/task/task.model";
import UserDb from "../../models/user/user";
import CommunityModel from "../../models/community/community.model";
import mongoose from 'mongoose';

export const RefrralMiddleaware = async (req: Request, res: Response, next: NextFunction) => {
    const communityId = req.params.id;
    
    const { referral, userId } = req.body;
    if (!referral) {
        return res.status(400).json({ message: "Invalid Call. Please Fill The referral" });
    }

    try {
        const referralCheck = await ReferralDb.findOne({ referralCode: referral });
        if (!referralCheck) {
            return res.status(404).json({ message: "Invalid Referral" });
        }

        const community = await CommunityModel.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }
        // console.log("ds",community._id.toString() !== referralCheck.communityInfo.toString())

        // Check if the community in the referral matches the community in the request
        if (community._id.toString() !== referralCheck.communityInfo.toString()) {
            return res.status(400).json({ message: "Wrong community" });
        }

        const taskId = referralCheck.taskInfo;

        if (!taskId) {
            return res.status(400).json({ message: "Task information is missing from referral" });
        }
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const userIdFromReferral = referralCheck.userInfo;
        if (!userIdFromReferral) {
            return res.status(400).json({ message: "User information is missing from referral" });
        }
        const user = await UserDb.findById(userIdFromReferral);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // console.log("first",user)
        // Check if the user has already completed this task
        const alreadyCompleted = task.completions?.some(
            (completion) => completion.user.toString() === userIdFromReferral.toString()
        );

        if (alreadyCompleted) {
            return res.status(400).json({ message: "Task already completed by this user" });
        }

        // Add the completion to the task
        if (!task.completions) {
            task.completions = [];
        }

        task.completions.push({
            user: new mongoose.Types.ObjectId(userIdFromReferral), // Convert to ObjectId
            completedAt: new Date(),
            submission: userId,
            userName: user.displayName
        });

        await task.save();

        // Add the task to the user's completed tasks
        if (!user.completedTasks) {
            user.completedTasks = [];
        }

        user.completedTasks.push(new mongoose.Types.ObjectId(taskId)); // Convert to ObjectId
        await user.save();
        // console.log(communityId,referral,userId);

        return next();
    } catch (error) {
        console.error("Error checking user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
