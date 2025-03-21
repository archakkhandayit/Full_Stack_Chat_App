import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utilities/axiosInstance";

export const sendMessageThunk = createAsyncThunk(
  "message/send",
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/message/send/${receiverId}`, {
            message
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

export const getMessageThunk = createAsyncThunk(
  "message/get",
  async ({ receiverId }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/message/get-messages/${receiverId}`);
        return response?.data;
    } catch (e) {
        if (e.code === 'ECONNABORTED') {
            return rejectWithValue('Request timed out');
        } else {   
            return rejectWithValue(e?.response?.data?.errMessage);
    }
  }
});
