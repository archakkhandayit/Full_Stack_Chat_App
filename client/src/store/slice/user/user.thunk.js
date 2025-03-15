import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utilities/axiosInstance";

import { deleteMessages } from "../message/message.slice.js"
import { clearSocketState } from '../socket/socket.js'


export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/user/login", {
            username,
            password,
        });
        return response?.data;
    } catch (e) {
        if (e.code === 'ECONNABORTED') {
            return rejectWithValue('Request timed out');
        } else {   
            return rejectWithValue(e?.response?.data?.errMessage);
    }
  }
});

export const signupUserThunk = createAsyncThunk(
  "user/signup",
  async ({ fullName, username, password, gender}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/user/signup", {
          fullName,
            username,
            password,
            gender,
        });
        return response?.data;
    } catch (e) {
        if (e.code === 'ECONNABORTED') {
            return rejectWithValue('Request timed out');
        } else {   
            return rejectWithValue(e?.response?.data?.errMessage);
    }
  }
});

export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async ( _ , { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/user/logout");
        dispatch(deleteMessages());
      dispatch(clearSocketState());
        return response?.data;
    } catch (e) {
        if (e.code === 'ECONNABORTED') {
            return rejectWithValue('Request timed out');
        } else {   
            return rejectWithValue(e?.response?.data?.errMessage);
    }
  }
});

export const getUserProfileThunk = createAsyncThunk(
  "user/get-profile",
  async ( _ , { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/user/get-profile");
        return response?.data;
    } catch (e) {
        if (e.code === 'ECONNABORTED') {
            return rejectWithValue('Request timed out');
        } else {   
            return rejectWithValue(e?.response?.data?.errMessage);
    }
  }
});

export const getOtherUsersThunk = createAsyncThunk(
  "user/get-other-users",
  async ( _ , { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/user/get-other-users");
        return response?.data;
    } catch (e) {
        if (e.code === 'ECONNABORTED') {
            return rejectWithValue('Request timed out');
        } else {   
            return rejectWithValue(e?.response?.data?.errMessage);
    }
  }
});
