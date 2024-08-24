import { NextFunction, Request, Response } from 'express';
import KolsDB from '../../models/kols/kols';

/*
1. create kol
2. get all kol
3. get kol by id
4. update kol
5. delete kol
*/

export const createKols = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user =await req.body
    // console.log("Request Body:", user);
    // Check if `kolsData` exists in request body
    if (!req.body.kolsData) {
      return res.status(400).json({ error: "Bad Request", message: "No KolsData provided" });
    }
    const { name, userName, role, bio, imageUrl, upVotes, downVotes, socialLinks } = req.body.kolsData;

    if (!name || !userName || !role) {
      return res.status(400).json({ error: "Bad Request", message: "Missing required KolsData fields" });
    }

    // Check if a KolsData document with the same name, userName, and role already exists
    const existingKolsData = await KolsDB.findOne({
      name: name,
      userName: userName,
      role: role,
    });

    if (existingKolsData) {
      return res.status(409).json({
        error: "Conflict",
        message: "KolsData with the same name, userName, and role already exists",
      });
    }

    // Create and save the new KolsData document
    const newKolsData = new KolsDB({
      name,
      userName,
      role,
      bio,
      imageUrl,
      upVotes,
      downVotes,
      socialLinks,
    });

    await newKolsData.save();
    // console.log("KolsData saved:", newKolsData);

    // Respond with the newly created KolsData document
    return res.status(200).json({
      success: true,
      message: "KolsData added successfully",
      kolsData: newKolsData,
    });
  } catch (error) {
    console.error("Error in createKols:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAllKol = async (req: Request, res: Response) => {
  try {
    // Fetch all KolsData documents from the database
    const kols = await KolsDB.find();
    // console.log("KolsData fetched:", kols);
    // Respond with the fetched data
    return res.status(200).json({
      success: true,
      message: 'Fetched all KolsData documents successfully',
      kols,
    });
  } catch (error) {
    console.error('Error fetching KolsData:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error fetching KolsData',
    });
  }
};

export const getKolById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;  // Get the ID from the request parameters
    
    const kols = await KolsDB.findById(id);
    
    return res.status(200).json({
      success: true,
      message: 'Fetched KolsData document successfully',
      kols,
    });
  } catch (error) {
    console.error('Error fetching KolsData:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error fetching KolsData',
    });
  }
}

export const updateKol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, userName, role, bio, imageUrl, upVotes, downVotes, socialLinks } = req.body;
    const kols = await KolsDB.findByIdAndUpdate(id, { name, userName, role, bio, imageUrl, upVotes, downVotes, socialLinks }, { new: true });
    return res.status(200).json({
      success: true,
      message: 'KolsData updated successfully',
      kols,
    });
  } catch (error) {
    console.error('Error updating KolsData:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error updating KolsData',
    });
  }
}

export const deleteKol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const kols = await KolsDB.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: 'KolsData deleted successfully',
      kols,
    });
  } catch (error) {
    console.error('Error deleting KolsData:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error deleting KolsData',
    });
  }
}


export const rateKol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const kols = await KolsDB.findById(id);
    if (!kols) {
      return res.status(404).json({
        success: false,
        message: 'KolsData not found',
      });
    }
    kols.upVotes += rating;
    await kols.save();
    return res.status(200).json({
      success: true,
      message: 'KolsData rated successfully',
      kols,
    });
  } catch (error) {
    console.error('Error rating KolsData:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error rating KolsData', 
    });
  }
}