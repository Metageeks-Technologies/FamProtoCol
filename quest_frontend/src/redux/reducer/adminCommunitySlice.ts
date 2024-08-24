import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface CommunityState {
  categories: string[];
  ecosystems: string[];
  description: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  categories: [],
  ecosystems: [],
  description: null,
  loading: false,
  error: null,
};

export const getCommunitySuccess = createAsyncThunk(
  'addcommunity/getCommunitySuccess',
  async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get( `${ process.env.NEXT_PUBLIC_SERVER_URL }/admin/getCommunityData` );
        // console.log(response)
      return response.data.community; // Ensure that the correct data is being returned
    } catch (err) {
      return rejectWithValue('Failed to fetch community data');
    }
  }
);

const addcommunitySlice = createSlice({
  name: 'addcommunity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommunitySuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommunitySuccess.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.ecosystems = action.payload.ecosystems;
        state.description = action.payload.description;
      })
      .addCase(getCommunitySuccess.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addcommunitySlice.reducer;
