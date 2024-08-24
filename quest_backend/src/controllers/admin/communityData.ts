import { Request, Response } from 'express';
import CommunityData from '../../models/admin/communityData';

// Controller to get community details
export const getCommunityData = async ( req: Request, res: Response ) =>
{
  try
  {
    const community = await CommunityData.findOne();
    if ( !community )
    {
      return res.status( 404 ).json( { message: 'Community not found' } );
    }
    res.status(200).json({community,message:'Community meta data fetched successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to add community details

export const addCommunityData = async (req: Request, res: Response) => {
  try {
    const { name, imageUrl,type } = req.body;
    const communityData = await CommunityData.findOne();

    if (!communityData) {
      return res.status(404).json({ message: 'Community data not found' });
    }

    if(type==='category'){
       const newCategory = { name, imageUrl };
      communityData.categories.push(newCategory);
    }
    else if(type==='ecosystem'){
      const newEcosystem = { name, imageUrl };
      communityData.ecosystems.push(newEcosystem);
    }
    else{
      return res.status(400).json({ message: 'Invalid community data type' });
    }
    await communityData.save();

    res.status(200).json({message: 'Community data added successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Failed to add ecosystem', error });
  }
};


// Update category or ecosystem by id
export const updateById = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.params;
    const { name, imageUrl } = req.body;

    const communityData:any = await CommunityData.findOne();
    if (!communityData) {
      return res.status(404).json({ message: 'Community data not found' });
    }

    let item;
    if (type === 'categoryEdit') {
      item = communityData.categories.id(id);
    } else if (type === 'ecosystemEdit') {
      item = communityData.ecosystems.id(id);
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    if (!item) {
      return res.status(404).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found` });
    }

    if(name)item.name = name;
    if(imageUrl)item.imageUrl = imageUrl;

    await communityData.save();
    res.status(200).json({message:` meta data updated successfully`});
  } catch (error) {
    res.status(500).json({ message:`Failed to update , ${error} `});
  }
};

// Delete category or ecosystem by id
export const deleteById = async (req: Request, res: Response) => {
  const {type ,id}=req.params 
  try {

    const communityData = await CommunityData.findOne();
    if (!communityData) {
      return res.status(404).json({ message: 'Community data not found' });
    }

    if (type === 'category') {
      const categoryIndex = communityData.categories.findIndex(category => category?._id?.toString() === id);
      if (categoryIndex === -1) {
        return res.status(404).json({ message: 'Category not found' });
      }
      communityData.categories.splice(categoryIndex, 1);
    } else if (type === 'ecosystem') {
      const ecosystemIndex = communityData.ecosystems.findIndex(ecosystem => ecosystem?._id?.toString() === id);
      if (ecosystemIndex === -1) {
        return res.status(404).json({ message: 'Ecosystem not found' });
      }
      communityData.ecosystems.splice(ecosystemIndex, 1);
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    await communityData.save();
    res.status(200).json({message:`${type} deleted successfully`});
  } catch (error) {
    res.status(500).json({ message:error });
  }
};
