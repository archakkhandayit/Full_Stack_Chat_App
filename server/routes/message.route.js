import { Router } from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getMessages, sendMessage, pollMessages } from '../controllers/message.controller.js';

const messageRouter = new Router();

//From "/api/v1/message"
messageRouter.post("/send/:receiverId", isAuthenticated, sendMessage);
messageRouter.get("/get-messages/:otherParticipantId", isAuthenticated, getMessages);
messageRouter.get("/poll-messages/:otherParticipantId", isAuthenticated, pollMessages);

export default messageRouter