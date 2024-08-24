import mongoose, { Model, Schema } from "mongoose";

export interface Community
{
    _id?: string | any;
    title: string;
    description?: string;
    count_of_members?: number;
    logo: string;
    ecosystem: string;
    category: string[];
    quests?: string[];
    members?: string[];
    creator?: mongoose.Types.ObjectId;
}

const CommunitySchema: Schema = new mongoose.Schema<Community>( {
    title: { type: String, required: true },
    description: { type: String },
    count_of_members: { type: Number, required: true, default: 0 },
    logo: { type: String,  },
    ecosystem: [ { type: String, required: true } ],
    category: [ { type: String, required: true } ],
    quests: [ { type: Schema.Types.ObjectId, ref: 'Quest' } ],
    members: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
    creator: { type: Schema.Types.ObjectId, ref: 'User' }

}, {
    timestamps: true
} );

const CommunityModel: Model<Community> = mongoose.model<Community>( 'Community', CommunitySchema );

export default CommunityModel;
