import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null
};

const authReducer = createSlice({
  name: "auth", // name of the key in state
  initialState,
  reducers: {
    setSessionUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setSessionUser } = authReducer.actions;

export default authReducer.reducer;
