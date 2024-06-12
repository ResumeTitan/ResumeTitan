import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  token: null,
  jobs: [],
  activeResume: null,
  activeInterview: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.activeResume = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setActiveResume: (state, action) => {
      state.activeResume = action.payload;
    },
    setActiveInterview: (state, action) => {
      state.activeInterview = action.payload;
    },
  },
});

export const { 
  setMode, 
  setLogin, 
  setLogout,
  setUser,  
  setFriends, 
  setJobs, 
  setJob, 
  addJob, 
  deleteJob, 
  setActiveResume,
  setActiveInterview
} =
  authSlice.actions;
export default authSlice.reducer;