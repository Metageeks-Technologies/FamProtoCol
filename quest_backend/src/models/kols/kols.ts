import mongoose, { Document, Schema } from 'mongoose';
import { Community } from '../community/community.model';
import { IDiscordInfo, ITwitterInfo } from '../user/user';

// Define the interface based on the provided structure

export interface IKolsData extends Document {
  googleId: string;
  displayName: string;
  email: string;
  image: string;
  role:string;
  bio:string;
  nickname:string;
  bgImage:string;
  badjes?: string[];
  upVotes: number;
  downVotes: number;
  community: Community[];
  task?: string[];
  twitterInfo?: ITwitterInfo;
  discordInfo?: IDiscordInfo;
}


// Define the schema
const KolsDataSchema: Schema = new Schema({
  googleId: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },  
  role: { type: String, default: 'kol' },
  bio:  {type:String},
  bgImage:{type:String},
  nickname:  {type:String},
  badges:{type:[String]},
  upVotes: { type: Number },
  downVotes: { type: Number },
  community: [{ type: Schema.Types.ObjectId, ref: "Community" }],
  quest: [ { type: Schema.Types.ObjectId, ref: "Quest" } ],
  task: [ {
    type: Schema.Types.ObjectId, ref: "Task" 
  }],
  twitterInfo: {
    twitterId: { type: String },
    username: { type: String },
    profileImageUrl: { type: String },
    oauthToken: { type: String },
    oauthTokenSecret: { type: String },
  },
  discordInfo: {
    discordId: { type: String },
    username: { type: String },
    profileImageUrl: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    guilds: { type: [String] },
  },
}, {
  timestamps: true   
});

// Create the model
const KolsDB = mongoose.model<IKolsData>('KolsData', KolsDataSchema);

export default KolsDB;




