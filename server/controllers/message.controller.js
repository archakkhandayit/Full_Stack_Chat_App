import messageModel from "../models/message.model.js";
import conversationModel from "../models/conversation.model.js";
import asyncHandler from "../utilities/asyncHandler.utility.js";
import errorHandler from "../utilities/errorHandler.utility.js";
import { io, getSocketId } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.userId;
  const receiverId = req.params.receiverId;
  const message = req.body.message;
  if (!senderId || !receiverId || !message) {
    return next(new errorHandler("All fields are required", 400));
  }

  let conversation = await conversationModel.findOne({
    participants: { $all: [senderId, receiverId] },
    // $all is a MongoDB operator that selects the documents where the value of a field is an array that contains all the specified elements.
  });
  if (!conversation) {
    conversation = await conversationModel.create({
      participants: [senderId, receiverId],
    });
  }
  const newMessage = await messageModel.create({
    senderId,
    receiverId,
    message,
  });
  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }

  // socket.io
  const socketId = getSocketId(receiverId)
  io.to(socketId).emit("newMessage",newMessage)

  res.status(200).json({
    success: true,
    responseData: {
      newMessage,
    },
  });
});

export const getMessages = asyncHandler(async (req, res, next) => {
  const myId = req.userId;
  const otherParticipantId = req.params.otherParticipantId;
  if (!myId || !otherParticipantId) {
    return next(new errorHandler("All fields are required", 400));
  }
  const conversation = await conversationModel
    .findOne({
      participants: { $all: [myId, otherParticipantId] },
    })
    .populate("messages")
    .lean();
  // The lean() function is used to get a plain JavaScript object instead of a Mongoose document.

  //not sending the createdAt, updatedAt, and __v fields (of conversation document) to the client
  const { createdAt, updatedAt, __v, ...filteredConversation } = conversation;

  res.status(200).json({
    success: true,
    responseData: {
      conversation: filteredConversation,
    },
  });
});


export const pollMessages = asyncHandler(async (req, res, next) => {
  const myId = req.userId;
  const otherParticipantId = req.params.otherParticipantId;
  const { timestamp } = req.query;

  if (!myId || !otherParticipantId || !timestamp) {
    return next(new errorHandler("All fields are required", 400));
  }

  const conversation = await conversationModel
    .findOne({
      participants: { $all: [myId, otherParticipantId] },
    })
    .populate({
      path: "messages",
      match: { updatedAt: { $gt: new Date(timestamp) } }, // Filter messages by updatedAt
    })
    .lean();

  if (!conversation) {
    return res.status(200).json({
      success: true,
      responseData: {
        newMessages: [],
      },
    });
  }

  res.status(200).json({
    success: true,
    responseData: {
      newMessages: conversation.messages,
    },
  });
});
