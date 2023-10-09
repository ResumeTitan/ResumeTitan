import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  token: null,
  schools: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      console.log(`Logging in ${action.payload.user.username}`);

      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
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
    }
  },
});

export const { setMode, setLogin, setLogout, setFriends, setSchools, addSchool, setSchool, deleteSchool } =
  authSlice.actions;
export default authSlice.reducer;