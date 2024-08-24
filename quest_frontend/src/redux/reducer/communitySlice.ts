import { notify } from '@/utils/notify';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface CommunityData {
  _id: string;
  title: string;
  description?: string;
  count_of_members?: number;
  logo: string;
  ecosystem: string[];
  category: string[];
  quests?: string[];
  members?: string[];
  createdAt?: string;
  updatedAt?: string;
  creator?: string;
}
export interface forAll{
  ecosystem: string[];
  category: string[];
  
}
interface CommunityState
{
  allCommunities: CommunityData | null;
  data: CommunityData | null;
  userCommunities: [];
  loading: boolean;
  error: string | null;
  forall:forAll|null
  ecosystemCommunities?: []
}

const initialState: CommunityState = {
  allCommunities: null,
  userCommunities: [],
  data: null,
  loading: false,
  error: null,
  forall:null,
  ecosystemCommunities:[]
};



// fetch the community
export const fetchAllCommunities = createAsyncThunk(
  'community/fetchAllCommunities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get( `${ process.env.NEXT_PUBLIC_SERVER_URL }/community/` );
      return response.data.communities;
    } catch (err) {
      return rejectWithValue('Failed to fetch community data');
    }
  }
);

export const fetchCategoryEcosystem = createAsyncThunk(
  'community/fetchCategoryEcosystem ',
  async (ecosystem:string, { rejectWithValue }) => {
    try {
      const response = await axios.get( `${ process.env.NEXT_PUBLIC_SERVER_URL }/admin/getCommunityData/${ecosystem}` );
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch community data');
    }
  }
);

// fetch the community by id
export const fetchCommunity = createAsyncThunk(
  'community/fetchCommunity',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/community/${id}`);
      return response.data.community;
    } catch (err) {
      return rejectWithValue('Failed to fetch community data');
    }
  }
);

// create a community;
export const createCommunity = createAsyncThunk(
  'community/createCommunity',
  async (communityData: {title: string;
    description: string;
    logo: string;
    category: string[];
    ecosystem: string;
  }, { rejectWithValue } ) =>
  {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/community/`,
        communityData
      );
      // console.log(response.data)
      return response.data.community;
    } catch (err) {
      return rejectWithValue('Failed to create community');
    }
  }
);

// fetch  all communitites by user/kols id
export const fetchCommunitiesByIds = createAsyncThunk(
  'community/fetchCommunitiesByIds',
  async (communityIds: string[], thunkAPI) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/community/getByIds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ communityIds }),
      });
      const data = await response.json();
      return data.communities;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch communities');
    }
  }
);

// join the community
export const joinCommunity = createAsyncThunk(
  'community/joinCommunity',
  async ( { memberId, id }:{ memberId: string|undefined; id: string }, thunkAPI ) =>
  {
    try
    {
      const response = await axios.post(
        `${ process.env.NEXT_PUBLIC_SERVER_URL }/community/joinCommunity/${id}`
        , { memberId }
      );
      // console.log( response.data.message )
      return response.data.community;
    }
    catch ( err:any )
    {
      notify('warn',err.response.data.message)
      console.log("error in joining :-", err)
      return thunkAPI.rejectWithValue( 'Failed to join community' );
    }
  }
);
  



const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase( fetchCommunity.pending, ( state ) =>
      {
        state.loading = true;
        state.error = null;
      } )
      .addCase( fetchCommunity.fulfilled, ( state, action ) =>
      {
        state.loading = false;
        state.data = action.payload;
      } )
      .addCase( fetchCommunity.rejected, ( state, action ) =>
      {
        state.loading = false;
        state.error = action.payload as string;
      } )
      
      .addCase( fetchAllCommunities.pending, ( state ) =>
      {
        state.loading = true;
        state.error = null;
      } )
      .addCase( fetchAllCommunities.fulfilled, ( state, action ) =>
      {
        state.loading = false;
        state.allCommunities = action.payload;
      } )
      .addCase( fetchAllCommunities.rejected, ( state, action ) =>
      {
        state.loading = false;
        state.error = action.payload as string;
      } )

      .addCase( createCommunity.pending, ( state ) =>
      {
        state.loading = true;
        state.error = null;
      } )
      .addCase( createCommunity.fulfilled, ( state, action ) =>
      {
        state.loading = false;
        state.data = action.payload;
      } )
      .addCase( createCommunity.rejected, ( state, action ) =>
      {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategoryEcosystem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryEcosystem.fulfilled, (state, action) => {
        state.loading = false;
        state.forall = {
          ecosystem: action.payload.ecosystems,
          category: action.payload.categories,
        };
      })
      .addCase(fetchCategoryEcosystem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })    
      .addCase( fetchCommunitiesByIds.fulfilled, (state,action ) =>
      {
        state.loading = false;
        state.userCommunities = action.payload;
      } )

      // .addCase(fetchCategoryEcosystem.fulfilled, (state,action)=>{
      //   state.loading = false
      //   state.ecosystemCommunities = action.payload;
      // })
  },
});

export default communitySlice.reducer;