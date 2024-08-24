import { Request, Response } from 'express';
import Grant from '../../models/grants/grants'; 

// Get all grants
export const getGrants = async (req: Request, res: Response) => {
  try {
    const grants = await Grant.find();
    if (!grants) {
      return res.status(404).json({ message: 'No grants found' });
    }
    res.status(200).json({ grants, message: 'Grants fetched successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add a new grant
export const addGrant = async (req: Request, res: Response) => {
  try {
    const { title, description, logoUrl, organizer, prize } = req.body;
    const newGrant = new Grant({ title, description, logoUrl, organizer, prize });
    await newGrant.save();
    res.status(201).json({ message: 'Grant added successfully', grant: newGrant });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add grant', error });
  }
};

// Update a grant by ID
export const updateGrantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, logoUrl, organizer, prize } = req.body;

    const updatedGrant = await Grant.findByIdAndUpdate(
      id,
      { title, description, logoUrl, organizer, prize },
      { new: true }
    );

    if (!updatedGrant) {
      return res.status(404).json({ message: 'Grant not found' });
    }

    res.status(200).json({ message: 'Grant updated successfully', grant: updatedGrant });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update grant', error });
  }
};

// Delete a grant by ID
export const deleteGrantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedGrant = await Grant.findByIdAndDelete(id);

    if (!deletedGrant) {
      return res.status(404).json({ message: 'Grant not found' });
    }

    res.status(200).json({ message: 'Grant deleted successfully', grant: deletedGrant });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete grant', error });
  }
};
