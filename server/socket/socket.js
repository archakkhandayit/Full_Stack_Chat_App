import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const userSocketMap = {
  // userId : socket.id
};

console.log("CORS allowed origin:", process.env.CLIENT_URL);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true, // ✅ Required for authentication (cookies, JWTs)
    methods: ["GET", "POST"], // ✅ Explicitly allow necessary methods
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) return;
  userSocketMap[userId] = socket.id;

  io.emit("onlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});

const getSocketId = (userId) => {
  return userSocketMap[userId];
};

export { io, app, server, getSocketId };
