import { Request, Response } from 'express';
import Feed from '../../models/feed/feed';

export const addFeed = async (req: Request, res: Response) => {
    // console.log(req.body);
    const { title, author, imageUrl, summary,description } = req.body;
    try {
        if (!title || !description || !imageUrl) {
            return res.status(400).json({ error: 'Title, description, and imageUrl are required' });
        }

        const newFeed = new Feed({ title, description, imageUrl, author, summary});
        const savedFeed = await newFeed.save();

        res.status(201).json({ success: true, feed: savedFeed });
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ error: 'Unable to create feed', details: error.message });
    }
};

export const getFeeds = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
        const feeds = await Feed.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

        const totalRecords = await Feed.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        res.status(200).json({ feeds,totalPages });
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ error: 'Unable to retrieve feeds', details: error.message });
    }
};

export const getFeedById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const feed = await Feed.findById(id);
        if (feed) {
            res.status(200).json({ success: true, feed });
        } else {
            res.status(404).json({ success: false, error: 'Feed not found' });
        }
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ error: 'Unable to retrieve feed', details: error.message });
    }
};
export const deleteFeed = async ( req: Request, res: Response ) =>
{
    // console.log(req);
    const { id } = req.params;
    try
    {
        const feed = await Feed.findByIdAndDelete( id );
        if ( feed )
        {
            res.status( 200 ).json( { success: true, feed } );
        } else
        {
            res.status( 404 ).json( { success: false, error: 'Feed not found' } );
        }
        
    } catch ( error: any )
    {
        console.error( error );
        res.status( 500 ).json( { error: 'Unable to delete feed', details: error.message } );
    }
};

export const updateFeed = async ( req: Request, res: Response ) =>
{
    // console.log(req);
    const { id } = req.params;
    const { title, description, imageUrl, author, summary } = req.body;
    try
    {
        const feed = await Feed.findByIdAndUpdate( id, { title, description,  imageUrl
            , author, summary
        }, { new: true } );
        if ( feed )
        {
            res.status( 200 ).json( { success: true, feed } );
        } else
        {
            res.status( 404 ).json( { success: false, error: 'Feed not found'
            } );
        }
    } catch ( error: any )
    {
        console.error( error );
        res.status( 500 ).json( { error: 'Unable to update feed', details: error.message } );
    }
};


    
    