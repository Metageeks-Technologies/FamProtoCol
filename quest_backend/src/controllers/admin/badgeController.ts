import { Request, Response } from 'express';
import { Badge } from '../../models/other models/models';

// Get all badges
export const getBadges = async (req: Request, res: Response) => {
  try {
    const badges = await Badge.find();
    if (!badges) {
        return res.status(404).json({ message: 'Badge not found' });
      }
    res.status(200).json({ badges, message: 'Badges fetched successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add a new badge
export const addBadge = async (req: Request, res: Response) => {
  try {
    const { name, level, imageUrl, questCriteria, taskCriteria } = req.body;
    const newBadge = new Badge({ name, level, imageUrl, questCriteria, taskCriteria });
    await newBadge.save();
    res.status(201).json({ message: 'Badge added successfully', badge: newBadge });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add badge', error });
  }
};

// Update a badge by ID
export const updateBadgeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, level, imageUrl, questCriteria, taskCriteria } = req.body;

    const updatedBadge = await Badge.findByIdAndUpdate(
      id,
      { name, level, imageUrl, questCriteria, taskCriteria },
      { new: true }
    );

    if (!updatedBadge) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    res.status(200).json({ message: 'Badge updated successfully', badge: updatedBadge });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update badge', error });
  }
};

// Delete a badge by ID
export const deleteBadgeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBadge = await Badge.findByIdAndDelete(id);

    if (!deletedBadge) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    res.status(200).json({ message: 'Badge deleted successfully', badge: deletedBadge });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete badge', error });
  }
};
