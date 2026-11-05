import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB1 } from "./db/connection1.db.js";
import { app, server } from "./socket/socket.js";
import { corsOptions } from "./config/cors.config.js";

// Middlewares
import errorMiddleware from "./middlewares/error.middleware.js";

// Routes
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";

await connectDB1();
const SERVER_PORT = process.env.SERVER_PORT || 3500;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json("App is running");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

app.use(errorMiddleware);

server.listen(SERVER_PORT, () => {
  console.log(`Server running at ${SERVER_PORT}`);
});

export default app;
