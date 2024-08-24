// userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Quest } from './questSlice';
import { persistor } from '../store';
import Cookies from 'js-cookie';
import axios from 'axios';

// Define interfaces for Twitter and Discord info
export interface ITwitterInfo
{
  twitterId?: string;
  username?: string;
  profileImageUrl?: string;
  oauthToken?: string;
  oauthTokenSecret?: string;
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
      const authToken = `Bearer ${ Cookies.get( 'authToken' ) }`;
      const response = await axios.get( `${ process.env.NEXT_PUBLIC_SERVER_URL }/auth/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
        withCredentials:true
      } );
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
      const response = await axios.get( `${ process.env.NEXT_PUBLIC_SERVER_URL }/auth/logout`, { withCredentials: true } );
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
      const authToken = `Bearer ${Cookies.get('authToken')}`;
      const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/profile/update`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },  
        withCredentials: true 
       });
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
