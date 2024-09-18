import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {RootState} from "../store";

interface NavState {
    nav: boolean;
}

const initialState: NavState = {
    nav: false,
};

// Async thunk for toggling the nav state
export const toggleNav = createAsyncThunk(
    "nav/toggleNav",
    async (currentState: boolean) => {
        return currentState; // Return the opposite of the current nav state
    }
);

const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(toggleNav.fulfilled, (state, action) => {
            state.nav = action.payload; // Update nav state with the payload
        });
    },
});
export const selectNavState = (state: RootState) => state.nav.nav; 
export default navSlice.reducer;