import mongoose, { Schema, Document } from 'mongoose';

interface IMintingReferral extends Document {
  referralCode: string;
  type: 'free' | 'discount'; // free or discount code
  maxRedemptions: number; // Limit on the number of times the code can be redeemed
  redeemedCount: number; // Current number of redemptions
  ExpiryDate: string; // Optional expiration date
}

const mintingReferralSchema: Schema = new Schema({
  referralCode: { type: String, required: true },
  type: { type: String, enum: ['free', 'discount'], required: true },
  maxRedemptions: { type: Number, required: true },
  redeemedCount: { type: Number, default: 0 },
  ExpiryDate:{type:String},
},{
    timestamps: true,
});

export default mongoose.model<IMintingReferral>('mintingReferral', mintingReferralSchema);
