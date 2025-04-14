import { createSlice } from "@reduxjs/toolkit";

import {
  sendMessageThunk,
  getMessageThunk,
  pollMessagesThunk,
} from "./message.thunk";

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

    // Poll Messages
    {
      builder.addCase(pollMessagesThunk.fulfilled, (state, action) => {
        const newMessages = action?.payload?.responseData?.newMessages;
        const userProfile = action?.payload?.userProfile;

        // Add debugging logs
        if (newMessages?.length > 0) {
          // add to state only if userProfile._id !== receiverId

          // Create a Set of existing message IDs
          const existingMessageIds = new Set(state.messages.map((m) => m._id));

          // Filtering duplicats and checking receiverId
          const uniqueNewMessages = newMessages.filter((message) => {
            const isDuplicate = existingMessageIds.has(message._id);
            const isForCurrentUser = message?.receiverId === userProfile?._id;

            return !isDuplicate && isForCurrentUser;
          });

          state.messages = [...state.messages, ...uniqueNewMessages];
        }
      });
    }
  },
});

// Action creators are generated for each case reducer function
export const { setNewMessage, deleteMessages } = messageSlice.actions;

export default messageSlice.reducer;
