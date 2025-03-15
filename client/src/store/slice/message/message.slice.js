import { createSlice } from "@reduxjs/toolkit";

import { sendMessageThunk, getMessageThunk } from "./message.thunk";
const initialState = {
  screenLoading: true,
  buttonLoading: false,
  messages: [],
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setNewMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    deleteMessages: (state, action) => {
      state.messages = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed

    // Send Message
    {
      builder.addCase(sendMessageThunk.pending, (state, action) => {
        state.buttonLoading = true;
      });
      builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.buttonLoading = false;
        state.messages = [
          ...state.messages,
          action.payload?.responseData?.newMessage,
        ];
      });
      builder.addCase(sendMessageThunk.rejected, (state, action) => {
        state.buttonLoading = false;
      });
    }

    // Get messages
    {
      builder.addCase(getMessageThunk.pending, (state, action) => {
        state.buttonLoading = true;
      });
      builder.addCase(getMessageThunk.fulfilled, (state, action) => {
        state.messages = action?.payload?.responseData?.conversation?.messages;
        state.buttonLoading = false;
      });
      builder.addCase(getMessageThunk.rejected, (state, action) => {
        state.buttonLoading = false;
        state.messages = null;
      });
    }
  },
});

// Action creators are generated for each case reducer function
export const { setNewMessage, deleteMessages } = messageSlice.actions;

export default messageSlice.reducer;
