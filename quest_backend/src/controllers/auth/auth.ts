import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import UserDb, { IUser, generateToken } from "../../models/user/user";
import { auth } from "../../utils/fireAdmin";
import {
  checkInviteLink,
} from "../discord/discord";
import { jwtUser } from "../../middleware/user/verifyToken";

dotenv.config();
const publicClientUrl = process.env.PUBLIC_CLIENT_URL as string;

export const loginSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      user: req.user,
    });
  } else {
    res.status(403).json({
      error: true,
      message: "Not authorized",
    });
  }
};

export const loginFailed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(401).json({
    error: true,
    message: "Login failure",
  });
};

// logout
export const logout = async (req: Request, res: Response) => {
   res.clearCookie("_fam_token", {
    httpOnly: true,   // Ensure the cookie is not accessible via client-side JavaScript
    secure: process.env.NODE_ENV === 'production', // Use secure flag in production
    sameSite: 'strict',  // Protect against CSRF
    path: '/',  // Specify the path where the cookie is set (usually '/')
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const updateUser = async (req: Request, res: Response) => {
  const {id} = req.user as any;
  const { bio,displayName, image } = req.body; // Extract the fields from the request body
  // console.log( "user", req.user );
  // console.log( "req.body", req.body );
  try {
    // Check the role and find the appropriate user document
  
    const user = await UserDb.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found. Please login" });
    }
    // console.log( "data", data );

    // Update user fields
    if(bio){
      user.bio = bio;
    }
    if(displayName){
      user.displayName = displayName;
    }
    if(image){
      user.domain.image = image;
    }
    await user.save(); // Save the updated user document

    return res.status(200).json({ message: "User updated successfully", user });
    // Save the updated kol document
  } catch (error) {
    console.error("Error updating user or KOL:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating user or KOL" });
  }
};

export const checkExistingUser = async (req: Request, res: Response) => {
  const { phone_number } = req.body;
  try {
    // console.log(req.body);
    const user = await UserDb.findOne({ phone_number });
    // console.log(user);
    if (user) {
      return res.status(201).json({
        success: true,
        message: "User already exists",
        existingUser: user,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User does not exist",
    });
  } catch (error) {
    console.error("Error checking existing user:", error);
    return res.status(500).json({
      error: "An error occurred while checking existing user",
    });
  }
};

const verifyPhoneNumberToken = async (idToken: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export const verifyPhone = async (req: Request, res: Response) => {
  const users = req.body;
  // console.log(req.body)
  const idToken = users.idToken;
  const num = users.number;
  const img = users.img;
  const name = users.name;
  // console.log("id token",idToken)
  try {
    const decodedToken = await verifyPhoneNumberToken(idToken);
    // console.log("decoded Token",decodedToken)
    if (!decodedToken) {
      return res.status(401).send("Authentication failed");
    } // Generate JWT token
    let user = await UserDb.findOne({ phone_number: num });
    if (!user) {
      user = new UserDb({
        phone_number: num,
        displayName: name,
        image: img,
      });

      await user.save();
      // console.log("created user",user)
    }

    const jwtToken = generateToken({
      ids: user._id as string,
      phone_number: user.phone_number,
    });
    // console.log("user not",user)

    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: "none" as "none", // path: process.env.CLIENT_URL,
    };
    // console.log("jwtToken:-",jwtToken, "Otiopns:-",options)
    // alert("User Authuthenticaed")
    res.status(200).cookie("_fam_token", jwtToken, options).json({
      success: true,
      authToken: jwtToken,
      message: "user authenticated succesfully",
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(401).send("Authentication failed");
  }
};

export const validateInviteUrl = async (req: Request, res: Response) => {
  const user = req.user as any;
  const userExist = await UserDb.findById(user.ids);
  if (!userExist) {
    return res.status(401).send("User is not authenticated");
  }
  if (!userExist.discordInfo || !userExist.discordInfo.accessToken) {
    return res.status(201).send("User does not have a Discord access token");
  }

  try {
    const inviteUrl = decodeURIComponent(req.params.inviteUrl);
    const validLink = await checkInviteLink(inviteUrl);
    if (validLink) {
      res
        .status(200)
        .json({
          success: true,
          message: "Valid link and bot is in the guild",
          validLink,
        });
    } else {
      res
        .status(200)
        .json({
          success: false,
          message: "INValid link . bot is not in the guild",
        });
    }
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return res
      .status(201)
      .send({ success: false, message: "Failed to fetch guilds" });
  }
};

export const getProfile = async (req: any, res: Response) => {
  const {id} = req.user ;
  const data = await UserDb.findById(id);
  if(!data){
    return res.status(401).send("User is not authenticated");
  }
  return res.status(200).send(data);
};

export const telegramCallback = async (req: Request, res: Response) => {
  try {
    // Extract query parameters from the request
    const { id, first_name, last_name, username, photo_url } = req.query as {
      id: string;
      first_name: string;
      last_name: string;
      username: string;
      photo_url: string;
    };

    console.log("first", id, first_name, last_name, username, photo_url);

    // Optional user verification
    const users = req.user as jwtUser;
    const userId = users.ids;
    console.log("second", userId);
    // Check if user exists in the database
    let userdata = await UserDb.findById(userId);
    // console.log("first",userdata)
    if (!userdata) {
      // User does not exist, respond with 404
      return res.status(404).send({ message: "Invalid user" });
    }

    // Update user details with Telegram data if the fields are provided
    userdata.teleInfo = {
      telegramId: id || userdata.teleInfo?.telegramId,
      teleName: first_name || userdata.teleInfo?.teleName,
      teleusername: username || userdata.teleInfo?.teleusername,
      teleimg: photo_url || userdata.teleInfo?.teleimg,
      telelastname: last_name || userdata.teleInfo?.telelastname,
    };

    await userdata.save();

    return res.status(200).send({ message: "Telegram connected successfully" });
    //  return res.redirect(`${process.env.PUBLIC_CLIENT_URL}/user/profile`);
  } catch (error) {
    console.error("Error during authentication:", error);
    return res.status(500).send({ message: "Try again later" });
  }
};
