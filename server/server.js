import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB1 } from './db/connection1.db.js';
import { app, server } from './socket/socket.js  '

connectDB1();
const SERVER_PORT = process.env.SERVER_PORT || 3500;

app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

//middlewares
import errorMiddleware from './middlewares/error.middleware.js';

//routes
import userRouter from './routes/user.route.js'
import messageRouter from './routes/message.route.js';

app.get('/',(req,res)=>{
    res.status(200).json("App is running")
})
app.use('/api/v1/user',userRouter)
app.use('/api/v1/message',messageRouter)

app.use(errorMiddleware);

server.listen(SERVER_PORT, () => {
    console.log(`Server running at ${SERVER_PORT}`);
})