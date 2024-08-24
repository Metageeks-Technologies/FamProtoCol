import { notify } from '@/utils/notify';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Base interface for all task types
interface ITaskBase extends Document
{
  _id: string;
  category: 'Actions' | 'Answers' | 'Social' | 'On-chain action';
  type: 'visit' | 'poll' | 'quiz' | 'invite' | 'upload';
  questId: string;
  creator: string;
  completions: Array<{
    user: string;
    completedAt: Date;
    submission?: string;
  }>;
} 

interface IQuiz {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface IPoll {
  question: string;
  options: string[];
}

// Combined type for all task types
export type TaskOrPoll = ITaskBase & {
  visitLink?: string;
  visitor?: string[];
 quizzes?: IQuiz[];
  polls?: IPoll[];
  correctAnswer?: string;
  inviteLink?: string;
  invitee?: string[];
  uploadLink?: string;
  taskName?:string;
  taskDescription?: string;
  uploadFileType?: string;
  walletsToConnect?: number;
  connectedWallets?: string[];
};


// Define the state interface
interface TaskState {
  tasks: TaskOrPoll[];
  currentTask:  [];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  currentTask: [],
  loading: false,
  error: null,
};

// API base URL
const API_BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/task`;

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }):Promise<any> => {
    try {
      const response = await axios.get( API_BASE_URL );
      console.log("response in task:-",response)
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch tasks');
    }
  }
);

// task by quest id
export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async ( id: string, { rejectWithValue } ):Promise<any> =>
  {
    try {
      const response = await axios.get( `${ API_BASE_URL }/${ id }` );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios errors
        if (error.response) {
          return rejectWithValue(`Error ${error.response.status}: ${error.response.data}`);
        } else if (error.request) {
          // The request was made but no response was received
          return rejectWithValue('No response received from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          return rejectWithValue(`Error: ${error.message}`);
        }
      }
      // Handle non-Axios errors  
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (task: Partial<TaskOrPoll>, { rejectWithValue }) : Promise<any> => {
    try {
      const response = await axios.post( API_BASE_URL, task );
      return response.data;
    } catch ( error )
    {
      console.log(error)
      return rejectWithValue('Failed to create task');
    }
  }
);

// connect to walllet
export const connetToWallets = createAsyncThunk(
  'tasks/create',
  async ({ taskId,  address }: { taskId: string, address: string }) : Promise<any> => {
    try {
      const response = await axios.post( `${ API_BASE_URL }/connect-wallet`, {taskId,address} );
      console.log( "wallet connect response:-", response )
      notify("success","Wallet connect successfully")
      return response.data;
    } catch ( error )
    {
      console.log( "error in connecting to wallet:-", error )
      notify("error","Wallet address is already connected to this task")
      // return rejectWithValue('Failed to create task');
    }
  }
);


// complete the task
export const completeTask = createAsyncThunk(
  'tasks/complete',
  async ( { taskId, userId, submission, userName }: { taskId:string, userId:string | undefined, submission:string, userName:string | undefined}, { rejectWithValue } ): Promise<any> =>
  {
    try
    {
      const response = await axios.post( `${ API_BASE_URL }/complete`,
         { taskId, userId, submission, userName }
      );
      notify("success",response.data.message)
      return response.data;
    }
    catch ( error:any )
    {
      notify("error",error?.response?.data?.message);
      return rejectWithValue( 'Failed to complete task' );
    }
  }
);
  


// delete the perticular task
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete task');
    }
  }
);



// Create the slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<TaskOrPoll[] | any>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      } )
      
      // Fetch task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<TaskOrPoll | any>) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      } )
      
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<TaskOrPoll | any>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      } )
      
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string | any>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default taskSlice.reducer;