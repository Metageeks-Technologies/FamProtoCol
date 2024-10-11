import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../../models/user/user";
import { generateReferral } from "../../utils/helper/helper";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose, { ObjectId } from "mongoose";
import mintingReferral from "../../models/Referral/mintingReferral";

dotenv.config();

const JWT_SECRET_Token = process.env.JWT_SECRET as string;

export const signUpDomain = async (req: Request, res: Response) => {
  try {
    const {
      domainAddress,
      password,
      hashCode,
      walletAddress,
      image,
      referralCode,
    } = req.body;

    if (!domainAddress || !domainAddress.endsWith(".fam")) {
      return res.status(400).json({ message: "Invalid domain address"});
    }
    if (!hashCode || !walletAddress) {
      return res.status(400).json({ message: "Wallet not connected.try again later" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required to create an account" });
    }

    const existingUser = await User.findOne({
      "domain.domainAddress": domainAddress,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This domain address is already in use. Please choose another" });
    }

    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ inviteCode: referralCode });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      domain: {
        domainAddress,
        image,
        hashCode,
        walletAddress,
        password: hashedPassword,
      },
      image: image,
      referredBy: referrer ? referrer._id : undefined,
      inviteCode:domainAddress
    });

    await newUser.save();

    if (referrer) {
      referrer.referredUsers = referrer.referredUsers || [];
      referrer.referredUsers.push(newUser?._id as mongoose.Types.ObjectId);

      // Ensure rewards and coins are properly initialized
      referrer.rewards = referrer.rewards || { coins: 0, xp: 0 }; // Initialize rewards if undefined
      referrer.rewards.coins = referrer.rewards.coins || 0; // Initialize coins if undefined

      // Increment coins
      referrer.rewards.coins += 5;

      // Save the referrer object to persist changes
      await referrer.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, domain: newUser.domain.domainAddress },
      JWT_SECRET_Token,
      {
        expiresIn: "1d",
      }
    );

    // Set JWT in cookie
    res.cookie("_fam_token", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : ("lax" as "none" | "strict" | "lax" | undefined),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while creating the user account. Please try again later" });
  }
};

export const loginDomain = async (req: Request, res: Response) => {
  const { domainAddress, password, walletAddress } = req.body;
  console.log("req.body", req.body);
  try {
    if (!domainAddress && !password && !walletAddress) {
      return res.status(400).json({ message: "Please provide a domain with password or connect with a wallet address for authentication"});
    }

    if (domainAddress && password) {
      const user = await User.findOne({
        "domain.domainAddress": domainAddress,
      });

      if (!user) {
        return res.status(400).json({ message: "No account found with the provided domain address. Please check your domain and try again"});
      }
      // Check if password matches

      const isMatch = await bcrypt.compare(password, user.domain.password);

      if (!isMatch) {
        return res.status(400).json({ message: "The password you entered is incorrect. Please verify your password and try again" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, domain: user.domain.domainAddress },
        JWT_SECRET_Token,
        {
          expiresIn: "1d",
        }
      );

      // Set JWT in cookie
      res.cookie("_fam_token", token, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : ("lax" as "none" | "strict" | "lax" | undefined),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res
        .status(200)
        .json({ success: true, message: "Login successful", user });
    }

    if (walletAddress) {
      const user = await User.findOne({
        "domain.walletAddress": walletAddress,
      });

      if (!user) {
        return res.status(400).json({ message: "No account found with this wallet address. Please sign up to continue" });
      }
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, domain: user.domain.domainAddress },
        JWT_SECRET_Token,
        {
          expiresIn: "1d",
        }
      );
      console.log("token", token);
      // Set JWT in cookie
      res.cookie("_fam_token", token, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : ("lax" as "none" | "strict" | "lax" | undefined),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res
        .status(200)
        .json({ success: true, message: "Login successful", user });
    }
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred during login. Please try again later", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getFriendsByIds = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const friendsId = req.body.friendsIds;
    // console.log(friendsId)
    if (!Array.isArray(friendsId)) {
      res
        .status(400)
        .json({ message: "Invalid input: friendsId must be an array" });
      return;
    }
    const friends = await User.find({ _id: { $in: friendsId } }).sort({
      rank: 1,
    });

    res.status(200).json({
      message: "friendsId fetched successfully",
      friends,
    });
  } catch (error) {
    console.error("Error in getFriendsByIds:", error);
    res.status(500).json({
      message: "Internal server error while fetching friends",
    });
  }
};

export const followUser = async (req: Request, res: Response) => {
  const { userId, followId } = req.body;
  try {
    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.following.includes(followId)) {
      user.following.push(followId);
    }
    if (!followUser.followers.includes(userId)) {
      followUser.followers.push(userId);
    }

    await user.save();
    await followUser.save();

    res.status(200).json({ message: "Successfully followed" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  const { userId, unfollowId } = req.body;
  // console.log(userId, unfollowId);
  try {
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);

    if (!user || !unfollowUser) {
      return res.status(404).json({ message: "User not found" });
    }

    user.following = user.following.filter(
      (id) => id.toString() !== unfollowId
    );
    unfollowUser.followers = unfollowUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await unfollowUser.save();

    res.status(200).json({ message: "Successfully unfollowed" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500).json({ error: err });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users: any = await User.find();
    // console.log(users);
    const allUsers = users.sort(
      (a: any, b: any) => (b.rewards?.xp || 0) - (a.rewards?.xp || 0)
    );
    //  console.log("all useres:-",allUsers);
    for (let i = 0; i < allUsers.length; i++) {
      allUsers[i].rank = i + 1; // New rank for different points
      await allUsers[i].save();
    }
    res.status(200).json(users);
  } catch (err) {
    console.log("error in geting the users :-", err);
    res.status(500).json({ error: err });
  }
};

const generateUniqueReferralCode = async () => {
  let referralCode = generateReferral(8);
  let isUnique = false;

  while (!isUnique) {
    try {
      // Check if the referral code already exists in the database
      const existingReferral = await User.findOne({ inviteCode: referralCode });

      if (!existingReferral) {
        // If no existing referral code is found, it's unique
        isUnique = true;
      } else {
        // Generate a new referral code if it already exists
        referralCode = generateReferral(8);
      }
    } catch (error) {
      throw error; // Handle any other errors appropriately
    }
  }

  return referralCode;
};

export const generateReferralCode = async (req: any, res: Response) => {
  try {
    const referralCode = await generateUniqueReferralCode();
    const baseUrl = process.env.PUBLIC_CLIENT_URL;
    const referralLink = `${baseUrl}?referralCode=${referralCode}`;

    return res.status(200).json({ success: true, referralCode, referralLink });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const setReferralCode = async (req: any, res: Response) => {
  const { id } = req.user;
  try {
    
    const user = await User.findById(id);
    if(!user){
      return res.send({ success: false, message: "User not found" });
    }
    const { referralCode } = req.body;
    user.inviteCode = referralCode;
    await user.save();

    res.send({ success: true, message: "Referral code set successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
}

export const getDomains = async (req: Request, res: Response) => {
  try {
    const domains = await User.find({}, "domain.domainAddress");
    // console.log(domains);
    let filteredDomain = domains
      .filter((d: any) => d.domain && d.domain.domainAddress)
      .map((d: any) => d.domain.domainAddress);

    return res.send({ success: true, filteredDomain });
  } catch (err) {
    return res.send({ success: false, message: err });
  }
};

export const referredByUser = async (req: any, res: Response) => {
  const { id } = req.user;
  // console.log("req",req.user);
  // const id=req.user.id;
  try {
    const user = await User.findById(id).populate("referredUsers");
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }
    return res.send({
      success: true,
      message: "User fetched successfully",
      referredUsers: user.referredUsers,
    });
  } catch (err: any) {
    res.send({ success: false, message: "internal server error" });
  }
};

export const famTaskComplete=async (req: any, res: Response) => {
  const { id } = req.user;
  const {task,accountAddress}=req.body;
  console.log("req.body",req.body);
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }
    if(task.action!="multipleWalletConnect"){
      user.famTasks.push(task.action);
    }
    user.rewards = user.rewards || { coins: 0, xp: 0 }; // Initialize rewards if undefined
    user.rewards.coins = user.rewards.coins || 0; // Initialize coins if undefined

      // Increment coins
    user.rewards.coins += task.famPoints;
    if(accountAddress){
      user.famTasksSubmission.connectWallets.push(accountAddress);

      if(task.action==="multipleWalletConnect" && user.famTasksSubmission.connectWallets.length>=10){
        user.famTasks.push(task.action);
     }
    }
    await user.save();
    return res.send({
      success: true,
      message: "User fetched successfully",
      famTasks: user.famTasks,
    });
  } catch (err: any) {
    res.send({ success: false, message: "internal server error" });
  }
}

export const isValidReferral=async (req:any,res:Response)=>{
  try{
    console.log("req.body",req.body);
    const {referralCode}=req.body;
    const currentDate = new Date(); 
    
    if(!referralCode){
      return res.send({success:false,isFreeReferral:false,isDiscountReferral:false});
    }

    const freeReferrals = await mintingReferral.find({
      type: 'free',                // Condition for free referral type
      ExpiryDate: { $gte: currentDate }    // Condition for not expired
    });

    console.log("free referral",freeReferrals);

    const discountReferrals=await mintingReferral.find({
      type:'discount',
       ExpiryDate: { $gte: currentDate }  
    })

    console.log("discount",discountReferrals);
    const isFreeReferral=freeReferrals.some(referral => referral.referralCode === referralCode);
    const isDiscountReferral=discountReferrals.some(referral => referral.referralCode === referralCode);

    if(isFreeReferral){
      return res.send({success:true,isFreeReferral:true,isDiscountReferral:false});
    }
    if(isDiscountReferral){
      return res.send({success:true,isFreeReferral:false,isDiscountReferral:true});
    }
    return res.send({success:false,isFreeReferral:false,isDiscountReferral:false})
  }
  catch(error){
    return res.send({success:false,message:"internal server error"});
  }
};