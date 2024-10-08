// userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {Quest} from '@/types/types';
import axios from 'axios';
import mongoose from "mongoose"
import axiosInstance from '@/utils/axios/axios';

// Define interfaces for Twitter and Discord info
export interface ITwitterInfo
{
  twitterId?: string;
  username?: string;
  profileImageUrl?: string;
  accessToken?: string;
  refereshToken?: string;
}
export interface ITeleInfo
{
  telegramId?: string;
  teleName?: string;
  teleusername?: string;
}
export interface IDiscordInfo
{
  discordId?: string;
  username?: string;
  profileImageUrl?: string;
  accessToken: string;
  refreshToken: string;
  guilds?: string[];
}

// Define an interface for the User schema
export interface IUser
{
  phone_number: string;
  _id?: string;
  googleId: string;
  displayName: string;
  email: string;
  role: string;
  image: string;
  bio: string;
  nickname: string;
  bgImage: string;
  badjes?: string[];
  rank: string;
  quest: Quest[];
  twitterInfo?: ITwitterInfo;
  discordInfo?: IDiscordInfo;
  teleInfo?: ITeleInfo;
  community?: [];
  following?: string[];
  followers?: string[];
  rewards?: any;
  createdCommunities: [];
  createdQuests: [];
  createdTasks: [];
  domain:{
    domainAddress: string;
    image:string;
    hashCode: string;
    walletAddress: string;
    password: string;
  },
  inviteCode?: string;
  referredBy: mongoose.Types.ObjectId ;  // The user ID of the referrer
  referredUsers?: mongoose.Types.ObjectId[];  // List of user IDs referred by this user
  famTasks:string[];
  famTasksSubmission:{
    connectWallets:string[],
    gitScore:string;
  }
}

// Define the initial state interface
interface UserState
{
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

// Set the initial state
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Define async thunks
export const fetchUserData = createAsyncThunk(
  'login/fetchUserData',
  async ( _, { rejectWithValue } ) =>
  {
    try
    {
      const response = await axiosInstance.get( '/auth/profile');
      // console.log("response from userslice:", response.data );
      const data = response.data;
      return data;
    } catch ( err )
    {
      console.log( "Failed to detch user :-", err );
      return rejectWithValue( 'Failed to fetch user data' );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'login/logoutUser',
  async ( _, { rejectWithValue } ) =>
  {
    try
    {
      const response = await axiosInstance.get( '/auth/logout');
    //  console.log("response from logout",response)
      return response.data;
    } catch ( err )
    {
      return rejectWithValue( 'Failed to log out' );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'login/updateUserProfile',
  async (formData: Partial<IUser>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/auth/profile/update', formData);
      return response.data.user;
    } catch ( err )
    {
      return rejectWithValue( 'Failed to update user profile' );
    }
  }
);

// Create the slice
const userSlice = createSlice( {
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: ( builder ) =>
  {
    builder
      // fetchUserData handles fetching user profile data
      .addCase( fetchUserData.pending, ( state ) =>
      {
        state.loading = true;
        state.error = null;
      } )
      .addCase( fetchUserData.fulfilled, ( state, action: PayloadAction<IUser> ) =>
      {
        state.loading = false;
        state.user = action.payload;
      } )
      .addCase( fetchUserData.rejected, ( state, action: PayloadAction<any> ) =>
      {
        state.loading = false;
        state.error = action.payload;
      } )
      .addCase( logoutUser.pending, ( state ) =>
      {
        state.loading = true;
        state.error = null;
      } )
      .addCase( logoutUser.fulfilled, ( state ) =>
      {
        state.loading = false;
        state.user = null;  // Ensure user state is cleared
      } )
      .addCase( logoutUser.rejected, ( state, action: PayloadAction<any> ) =>
      {
        state.loading = false;
        state.error = action.payload;
      } )
      .addCase( updateUserProfile.pending, ( state ) =>
      {
        state.loading = true;
        state.error = null;
      } )
      .addCase( updateUserProfile.fulfilled, ( state, action: PayloadAction<IUser> ) =>
      {
        state.loading = false;
        state.user = action.payload;
      } )
      .addCase( updateUserProfile.rejected, ( state, action: PayloadAction<any> ) =>
      {
        state.loading = false;
        state.error = action.payload;
      } );
  },
} );

export default userSlice.reducer;
