import mongoose, { Document, Model, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import jwt from 'jsonwebtoken';


const JWT_SECRET_Token=process.env.JWT_SECRET as string;

// Define interfaces for the sub-schemas
export interface ITwitterInfo {
  twitterId?: string;
  username?: string;
  profileImageUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface ITeleInfo {
  telegramId?: string;
  teleName?: string;
  teleusername?: string; 
  teleimg?:string;
  telelastname?:string;
}

export interface IDiscordInfo {
  discordId?: string;
  username?: string;
  profileImageUrl?: string;
  accessToken: string;
  refreshToken: string;
  guilds?: string[];
}

// Define an interface for the User schema
export interface IUser extends Document {
  phone_number: string;
  googleId:string;
  displayName: string;
  email: string;
  bio: string;
  nickname: string;
  bgImage: string;
  badges?: object[];
  role: string;
  image: string;
  rank: number;
  level: string;
  quest: mongoose.Types.ObjectId[];
  community: mongoose.Types.ObjectId[];
  rewards: {
    xp: number;
    coins: number;
  };
  completedTasks: mongoose.Types.ObjectId[];
  twitterInfo?: ITwitterInfo;
  discordInfo?: IDiscordInfo;
  teleInfo?: ITeleInfo;
  followers: string[];
  following: string[];
  createdCommunities: mongoose.Types.ObjectId[];
  createdQuests: mongoose.Types.ObjectId[];
  createdTasks: mongoose.Types.ObjectId[];
  
}

// Create the User schema
const userSchema: Schema = new mongoose.Schema(
  {
    phone_number: { type: String},
    googleId:{ type: String },
    domain:{
      domainAddress: { type: String,unique:true },
      image:{type:String},
      hashCode: { type: String},
      walletAddress: { type: String },
      password: { type: String },
    },
    displayName: { type: String },
    email: { type: String },
    image: { type: String },
    bio: { type: String },
    bgImage: { type: String },
    nickname: { type: String },
    badges: { type: [ {} ] },
    role: { type: String, default: 'user' },
    level: { type: String, default: '-' },
    rank: { type: Number, default: 0 },
    quest: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quest" }],
    completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    community: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
    rewards: {
      xp: { type: Number, default: 0 },
      coins: { type: Number, default: 0 },
    },
    twitterInfo: {
      twitterId: { type: String },
      username: { type: String },
      profileImageUrl: { type: String },
      accessToken: { type: String },
      refreshToken: { type: String },
    },
    discordInfo: {
      discordId: { type: String },
      username: { type: String },
      profileImageUrl: { type: String },
      accessToken: { type: String },
      refreshToken: { type: String },
      guilds: { type: [String] },
    },
    teleInfo: {
      telegramId: { type: String,unique:true },
      teleName: { type: String },
      teleusername: { type: String },
      teleimg:{type:String},
      telelastname:{type:String}
    },
    followers: [{ type: String, default: [] }],
    following: [ { type: String, default: [] } ],
    
    createdTasks: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Task' } ],
    createdQuests: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' } ],
    createdCommunities: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Community' } ],
  },
  { timestamps: true }
);

// Create the User model
const UserDb: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserDb;

export const generateToken=({ids,phone_number}:{ids:string,phone_number:string})=>{
  const jwtToken = jwt.sign({ ids, phone_number }, JWT_SECRET_Token, { expiresIn: '24h' });
  return jwtToken;
} 