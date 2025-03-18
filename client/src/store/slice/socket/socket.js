import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialState = {
  socket: null,
  onlineUsers: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      const socket = io(import.meta.env.VITE_SERVER_SOCKET_URL, {
        query: { userId: action.payload },
        withCredentials: true, // ✅ Important for CORS/auth
        transports: ["websocket"], // Force WebSocket transport
        reconnection: false, // Disable reconnection
      });
      state.socket = socket;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    clearSocketState: (state, action) => {
      state.socket = null;
      state.onlineUsers = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { initializeSocket, setOnlineUsers, clearSocketState } =
  socketSlice.actions;

export default socketSlice.reducer;
