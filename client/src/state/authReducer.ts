import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the state
interface AuthState {
  mode: "light" | "dark";  // Only allow "light" or "dark" as values
  userId: string;
  token: string;
}

// Initialize the state with types
const initialState: AuthState = {
  mode: "dark",
  userId: "",
  token: '',
};

// Create the slice with typed state and actions
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setUserId: (state, action: PayloadAction<string>) => { // Payload type is string
      state.userId = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    }
  },
});

// Export the actions with correct types
export const { 
  setMode, 
  setUserId,
  setToken,
} = authSlice.actions;

// Export the reducer as default
export default authSlice.reducer;
