import { createSlice } from "@reduxjs/toolkit";
import {
  getOtherUsersThunk,
  getUserProfileThunk,
  loginUserThunk,
  logoutUserThunk,
  signupUserThunk,
} from "./user.thunk.js";

import toast from "react-hot-toast";

const initialState = {
  userProfile: null,
  otherUsers: null,
  selectedUser: JSON.parse(localStorage.getItem("selectedUser")) || null,
  isAuthenticated: false,
  screenLoading: true,
};
let loading;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      localStorage.setItem("selectedUser", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed

    // Login User
    {
      builder.addCase(loginUserThunk.pending, (state, action) => {
        loading = toast.loading("Logging in..");
      });
      builder.addCase(loginUserThunk.fulfilled, (state, action) => {
        state.userProfile = action.payload?.responseData?.user;
        state.isAuthenticated = true;
        toast.dismiss(loading);
        toast.success("Logged in Successfully");
      });
      builder.addCase(loginUserThunk.rejected, (state, action) => {
        toast.dismiss(loading);
        toast.error(action.payload || "Login Failed");
      });
    }

    // Signup User
    {
      builder.addCase(signupUserThunk.pending, (state, action) => {
        loading = toast.loading("Creating Account..");
      });
      builder.addCase(signupUserThunk.fulfilled, (state, action) => {
        state.userProfile = action.payload?.responseData?.user;
        state.isAuthenticated = true;
        toast.dismiss(loading);
        toast.success("Account Created Successfully");
      });
      builder.addCase(signupUserThunk.rejected, (state, action) => {
        toast.dismiss(loading);
        toast.error(action.payload || "Signup Failed");
      });
    }

    // Logout User
    {
      builder.addCase(logoutUserThunk.pending, (state, action) => {
        loading = toast.loading("Logging out..");
      });
      builder.addCase(logoutUserThunk.fulfilled, (state, action) => {
        state.userProfile = null;
        state.isAuthenticated = false;
        state.otherUsers = null;
        state.selectedUser = null;
        localStorage.clear();

        toast.dismiss(loading);
        toast.success("Logged out Successfully");
      });
      builder.addCase(logoutUserThunk.rejected, (state, action) => {
        toast.dismiss(loading);
        toast.error(action.payload || "Logout Failed");
      });
    }

    // Get User Profile
    {
      builder.addCase(getUserProfileThunk.pending, (state, action) => {});

      builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
        state.userProfile = action.payload?.responseData;
        state.isAuthenticated = true;
        state.screenLoading = false;
      });
      builder.addCase(getUserProfileThunk.rejected, (state, action) => {
        state.screenLoading = false;
      });
    }

    // Get Other users
    {
      builder.addCase(getOtherUsersThunk.pending, (state, action) => {});

      builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
        state.otherUsers = action.payload?.responseData.otherUsers;
      });
      builder.addCase(getOtherUsersThunk.rejected, (state, action) => {
        state.screenLoading = false;
      });
    }
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedUser } = userSlice.actions;

export default userSlice.reducer;
