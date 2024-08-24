import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/user/user";

export const createUserByDomain = async (req: Request, res: Response) => {
  try {
    const { domainAddress, password, hashCode, walletAddress,image } = req.body;

    if ( !domainAddress || !hashCode || !walletAddress || !password )
    {
      return res.status( 400 ).json( { message: 'Domain address and password are required' } );
    }

    const existingUser = await User.findOne( { 'domain.domainAddress': domainAddress } );
    if ( existingUser )
    {
      return res.status( 400 ).json( { message: 'Domain address already exists' } );
    }

    const hashedPassword = await bcrypt.hash( password, 10 );
    const newUser = new User( {
      domain: {
        domainAddress,
        image,
        hashCode,
        walletAddress,
        password: hashedPassword,
      },
    } );

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    return res.status( 200 ).json( { message: 'User created successfully', user: newUser } );
  } catch ( error )
  {
    console.error( error );
    return res.status( 500 ).json( { message: 'Server error' } );
  }
};

export const getUserById = async ( req: Request, res: Response ) =>
{

  const userId = req.params.id;
  try
  {
    const user = await User.findById( userId );
    if ( !user )
    {
      return res.status( 404 ).json( { message: "User not found" } );
    }
    res.status( 200 ).json( user );
  } catch ( error )
  {
    res.status( 500 ).json( { error: error } );
  }
};

export const getFriendsByIds = async ( req: Request, res: Response ): Promise<void> =>
{
  try
  {
    const friendsId = req.body.friendsIds;
    // console.log(friendsId)
    if ( !Array.isArray( friendsId ) )
    {
      res.status( 400 ).json( { message: 'Invalid input: friendsId must be an array' } );
      return;
    }
    const friends = await User.find( { _id: { $in: friendsId } } );

    res.status( 200 ).json( {
      message: "friendsId fetched successfully",
      friends
    } );
  } catch ( error )
  {
    console.error( 'Error in getFriendsByIds:', error );
    res.status( 500 ).json( {
      message: 'Internal server error while fetching friends'
    } );
  }
};

export const followUser = async ( req: Request, res: Response ) =>
{
  const { userId, followId } = req.body;
  try
  {
    const user = await User.findById( userId );
    const followUser = await User.findById( followId );

    if ( !user || !followUser )
    {
      return res.status( 404 ).json( { message: "User not found" } );
    }

    if ( !user.following.includes( followId ) )
    {
      user.following.push( followId );
    }
    if ( !followUser.followers.includes( userId ) )
    {
      followUser.followers.push( userId );
    }

    await user.save();
    await followUser.save();

    res.status( 200 ).json( { message: "Successfully followed" } );
  } catch ( error )
  {
    res.status( 500 ).json( { error: error } );
  }
};

export const unfollowUser = async ( req: Request, res: Response ) =>
{
  const { userId, unfollowId } = req.body;
  // console.log(userId, unfollowId);
  try
  {
    const user = await User.findById( userId );
    const unfollowUser = await User.findById( unfollowId );

    if ( !user || !unfollowUser )
    {
      return res.status( 404 ).json( { message: "User not found" } );
    }

    user.following = user.following.filter(
      ( id ) => id.toString() !== unfollowId
    );
    unfollowUser.followers = unfollowUser.followers.filter(
      ( id ) => id.toString() !== userId
    );

    await user.save();
    await unfollowUser.save();

    res.status( 200 ).json( { message: "Successfully unfollowed" } );
  } catch ( err )
  {
    console.log( err );
    res.sendStatus( 500 ).json( { error: err } );
  }
};

export const getAllUser = async ( req: Request, res: Response ) =>
{
  try
  {
    const users: any = await User.find();
    // console.log(users);
    const allUsers = users.sort( ( a: any, b: any ) => ( b.rewards?.xp || 0 ) - ( a.rewards?.xp || 0 ) );
    //  console.log("all useres:-",allUsers); 
    for ( let i = 0; i < allUsers.length; i++ ) {
      allUsers[ i ].rank = i + 1; // New rank for different points 
      await allUsers[ i ].save();
    }
    res.status( 200 ).json( users );
  } catch ( err )  {
    console.log( "error in geting the users :-", err );
    res.status( 500 ).json( { error: err } );
  }
}

  