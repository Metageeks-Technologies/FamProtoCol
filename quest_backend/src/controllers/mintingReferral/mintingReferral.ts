import mintingReferral from "../../models/Referral/mintingReferral";
import { Request, Response } from "express";

export const createReferral = async (req: Request, res: Response) => {
  try {
    const { referralCode, type, maxRedemptions, ExpiryDate } = req.body;
    console.log(referralCode, type, maxRedemptions, ExpiryDate);
    // Create new referral code
    const newReferral = new mintingReferral({
      referralCode,
      type,
      maxRedemptions,
      ExpiryDate,
    });

    await newReferral.save();
   return res.send({ message: 'Referral code created successfully', referral: newReferral });
  } catch (error) {
   return res.send({ message: 'Error creating referral code', error });
  }
};

export const getAllReferrals = async (req: Request, res: Response) => {
    try{
        const referrals = await mintingReferral.find();
       return res.send({ message: 'Referral codes retrieved successfully', referrals });
    }
    catch(error){
       return res.send({ message: 'Error retrieving referral codes', error });
    }
}

export const deleteReferral = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const deletedReferral = await mintingReferral.findByIdAndDelete(id);
       return res.send({ message: 'Referral code deleted successfully', deletedReferral });
    }
    catch(error){
       return res.send({ message: 'Error deleting referral code', error });
    }
}

export const updateReferral = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const { code, type, maxRedemptions, expiresAt } = req.body;
        const updatedReferral = await mintingReferral.findByIdAndUpdate(id, { code, type, maxRedemptions, expiresAt });
       return res.send({ message: 'Referral code updated successfully', updatedReferral });
    }
    catch(error){
      return res.send({ message: 'Error updating referral code', error });
    }
}

