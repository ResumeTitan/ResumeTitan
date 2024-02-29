import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: {name: "John Doe"},
  token: null,
  schools: [],
  jobs: [],
  activeResume: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      console.log(`Logging in ${action.payload.user.email}`);

      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = {name: "John Doe"};
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
    setSchools: (state, action) => {
      state.schools = action.payload.schools;
    },
    setSchool: (state, action) => {    
      const updatedSchools = state.schools.map((school) => {
        if (school.id === action.payload.school.id) {
          return action.payload.school;
        } else {
          return school;
        }
      });

      state.schools = updatedSchools;
    },
    addSchool: (state, action) => {
      state.schools.push(action.payload.school);
    },
    deleteSchool: (state, action) => {
      console.log("deleting school", action.payload.school.id)
      const updatedSchools = state.schools.filter(
        (school) => school.id !== action.payload.school.id
      );
      state.schools = updatedSchools;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload.jobs;
    },
    setJob: (state, action) => {    
      const updatedJobs = state.jobs.map((job) => {
        if (job.id === action.payload.job.id) {
          return action.payload.job;
        } else {
          return job;
        }
      });

      state.jobs = updatedJobs;
    },
    addJob: (state, action) => {
      console.log("adding job", action.payload.job);
      state.jobs.push(action.payload.job);
    },
    deleteJob: (state, action) => {
      console.log("deleting job", action.payload.job.id)
      const updatedJobs = state.schools.filter(
        (job) => job.id !== action.payload.job.id
      );
      state.jobs = updatedJobs;
    },
    setActiveResume: (state, action) => {
      state.activeResume = action.payload;
    },
  },
});

export const { 
  setMode, 
  setLogin, 
  setLogout, 
  setFriends, 
  setSchools, 
  addSchool, 
  setSchool, 
  deleteSchool, 
  setJobs, 
  setJob, 
  addJob, 
  deleteJob, 
  setActiveResume 
} =
  authSlice.actions;
export default authSlice.reducer;