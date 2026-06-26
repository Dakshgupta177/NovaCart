import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    stopLoading: (state) => {
      state.isLoading = false;
    },
    login: (state, action) => {
      state.status = true;
      state.userData = {
        ...state.userData,
        ...action.payload.userData,
      };
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    updateData: (state, action) => {
      state.userData = {
        ...state.userData,
        ...action.payload.userData,
      };
    },
  },
});

export const { login, logout, updateData, stopLoading } = authSlice.actions;
export default authSlice.reducer;
