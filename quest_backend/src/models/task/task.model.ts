import mongoose, { Document, Model, Schema } from 'mongoose';
import { type } from 'os';

// Base interface for all task types
export interface ITaskBase extends Document {
  category: 'Actions' | 'Answers' | 'Social' | 'On-chain action';
  // type: 'visit' | 'poll' | 'quiz' | 'invite' | 'upload';
  type: string;
  questId: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  completions: Array<{
    user: mongoose.Types.ObjectId;
    completedAt: Date;
    submission?: string;
    userName?: string;
  }>;
} 


interface IQuiz {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface IPoll {
  question: string;
  options: string[];
}

// Combined type for all task types
export type TaskOrPoll = ITaskBase & {
  _id: string;
  visitLink?: string;
  discord?:string;
  discordLink?:string
  guild?:string;
  visitor?: mongoose.Types.ObjectId[];
  quizzes?: IQuiz[];
 polls?: IPoll[];
  question?: string;
  options?: string[];
  correctAnswer?: string;
  inviteLink?: string;
  invitee?: mongoose.Types.ObjectId[];
  uploadLink?: string;
  response?: string | number;
  taskName?:string;
  taskDescription?: string;
  uploadFileType?: string;
    rewards: {
    xp: number;
    coins: number;
  };
  walletsToConnect?:number
  connectedWallets?: string[];
  opinionQuestion?: string;
  tweet?: {
    tweetUrl?: string;
    tweetAction?: string;
    tweetUsername?: string;
    tweetWords?: string[];
    defaultTweet?: string;
  };
  telegram?:{
    telegramLink?:string;
  }
};

const TaskSchema: Schema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    category: {
      type: String,
    },
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
      ref: 'Quest'
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user' 
    },
    // Optional fields based on task type
    visitLink: { type: String },
    discord:{type:String},
    guild:{type:String},
    discordLink:{type:String},
    visitor: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
        quizzes: [{
      question: { type: String },
      options: [{ type: String }],
      correctAnswer: { type: String }
    }],
    polls: [{
      question: { type: String },
      options: [{ type: String }]
    }],
    inviteLink: { type: String },
    invitee: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    uploadLink: { type: String },
    response: { type: String || Number },
    taskName:{type:String},
    taskDescription:{type:String},
  rewards: {
      xp: { type: Number, default: 0 },
      coins: { type: Number, default: 0 },
    },
  opinionQuestion: {type:String},
    completions: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      completedAt: { type: Date, default: Date.now },
      submission: { type: String },
      userName : {type : String}
    } ],
    uploadFileType: {
       type: String,
     },
    walletsToConnect: { type: Number, default: 0 },
    connectedWallets: [ { type: String } ],
    tweet:{
      tweetUrl: { type: String },
      tweetAction: { type: String },
      tweetUsername: { type: String},
      tweetWords:[{type:String}],
      defaultTweet:{type:String}, 
    },
    telegram:{
      telegramLink:{type:String}
    }
  },
  { timestamps: true }
);

// Create the model
const TaskModel: Model<TaskOrPoll> = mongoose.model<TaskOrPoll>('Task', TaskSchema);

export default TaskModel;