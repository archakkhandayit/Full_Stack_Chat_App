import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { corsOptions } from "../config/cors.config.js";

const app = express();
const server = http.createServer(app);

const userSocketMap = {
  // userId : socket.id
};

const io = new Server(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  // Guard against missing or serialized "undefined" / "null" values
  if (!userId || userId === "undefined" || userId === "null") return;

  userSocketMap[userId] = socket.id;
  io.emit("onlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // Only remove user if the disconnecting socket is the currently mapped one
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
      io.emit("onlineUsers", Object.keys(userSocketMap));
    }
  });
});

const getSocketId = (userId) => {
  return userSocketMap[userId];
};

export { io, app, server, getSocketId };
