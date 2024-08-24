import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Reward {
  type: string;
  value: number;
}

export interface Quest {
  title: string;
  description: string;
  type: string;
  status: string;
  rewards: Reward[];
  creator: any;
  community?: any;
  logo?: string;
  categories?: string[];
}

interface QuestState {
  allQuests: Quest[];
  addedQuest: Quest[];
  quests: [];
  currentQuests: [];
  loading: boolean;
  error: string | null;
}

const initialState: QuestState = {
  // all quests
  allQuests: [],
  addedQuest: [],
  // current quests from community
  currentQuests: [],
  quests: [],
  loading: false,
  error: null,
};

interface CreateQuestPayload {
  communityId?: string;
  questData?: Omit<Quest, "community">;
}

export const createQuest = createAsyncThunk(
  "quests/createQuest",
  async (
    { communityId, questData }: CreateQuestPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/communities/${communityId}/quests`,
        questData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If the error has a response from the server, return that message
        return rejectWithValue(
          error.response.data.message || "Failed to create quest"
        );
      }
      // If it's not an Axios error or doesn't have a response, return a generic message
      return rejectWithValue("An error occurred while creating the quest");
    }
  }
);

export const createQuest1 = createAsyncThunk(
  "quests/createQuest",
  async (newQuest: Quest, { rejectWithValue }) => {
    // console.log(newQuest);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/quest/`,
        newQuest
      );
      // console.log(response);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Failed to create quest");
    }
  }
);

// fetch all quests
export const fetchAllQuests = createAsyncThunk(
  "quests/fetchAllQuests",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/quest`
      );
      // console.log("all quests:-", response.data);
      return response.data.allQuests;
    } catch (err) {
      console.log("error in gettng quest details :", err);
      return "Failed to fetch quests";
    }
  }
);

// fetch all quests by ids
export const fetchQuests = createAsyncThunk(
  "quests/fetchQuests",
  async (questIds: string[], { rejectWithValue }) => {
    // console.log(questIds);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/quest/getByIds`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questIds }),
        }
      );
      const data = await response.json();
      // console.log(response);
      return data.quests;
    } catch (err) {
      console.log("error in gettng quest details :", err);
      return rejectWithValue("Failed to fetch quests");
    }
  }
);

// fetch quest by id
export const fetchQuestById = createAsyncThunk(
  "quests/fetchQuestById",
  async (id: string, { rejectWithValue }): Promise<any> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/quest/${id}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch quest data");
    }
  }
);

const questSlice = createSlice({
  name: "quests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createQuest1.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuest1.fulfilled, (state, action) => {
        state.loading = false;
        state.addedQuest.push(action.payload);
      })
      .addCase(createQuest1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuests.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuests = action.payload;
      } )
      .addCase(fetchAllQuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQuests.fulfilled, (state, action) => {
        state.loading = false;
        state.allQuests = action.payload;
      } )
       .addCase(fetchAllQuests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchQuestById.fulfilled, (state, action) => {
        state.loading = false;
        state.quests = action.payload.quest;
      });
  },
});

export default questSlice.reducer;
