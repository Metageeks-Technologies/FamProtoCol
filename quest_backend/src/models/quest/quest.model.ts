import mongoose, { Model, Schema } from "mongoose";

enum QuestType {
  MAIN = 'MAIN',
  SIDE = 'SIDE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

enum QuestStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

interface Reward {
  type: string;
  value: number;
}

export interface Quest {
  _id: string | mongoose.Types.ObjectId | any;
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  rewards: Reward[];
  tasks?: string[];
  creator?: mongoose.Types.ObjectId;
  community?: mongoose.Types.ObjectId;
  logo?: string;
  categories?: string[];
}

const QuestSchema: Schema = new mongoose.Schema<Quest>({
 
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: Object.values(QuestType),
  },
  status: {
    type: String,
    enum: Object.values(QuestStatus),
  },
  tasks: [],
  rewards: [{
    type: { type: String },
    value: { type: Number }
  }] ,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  logo: { type: String },
  categories: [],
}, {
  timestamps: true
}); 

const QuestModel: Model<Quest> = mongoose.model<Quest>("Quest", QuestSchema);

export default QuestModel;