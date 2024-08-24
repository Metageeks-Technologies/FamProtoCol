import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface ITaskOption {
  categories: string[];
  taskOptions: string[];
  loading: boolean;
  error: string | null;
};

const initialState: ITaskOption = {
  categories: [],
  taskOptions: [],
  loading: false,
  error: null,
};

export const getTaskOptionsSuccess = createAsyncThunk(
  'taskOption/getTaskOptionsSuccess',
  async (_, { rejectWithValue }): Promise<any> => {
    try {
        const response = await axios.get( `${ process.env.NEXT_PUBLIC_SERVER_URL }/task/task-options` );
      return response.data; // Ensure that the correct data is being returned
    } catch (err) {
      return rejectWithValue('Failed to fetch community data');
    }
  }
);

const getTaskOptionSlice = createSlice({
  name: 'taskOption',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTaskOptionsSuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskOptionsSuccess.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.taskOptions = action.payload.taskOptions;
   
      })
      .addCase(getTaskOptionsSuccess.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getTaskOptionSlice.reducer;
