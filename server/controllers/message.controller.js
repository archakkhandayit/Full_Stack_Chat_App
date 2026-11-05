import mongoose from "mongoose";
import messageModel from "../models/message.model.js";
import conversationModel from "../models/conversation.model.js";
import userModel from "../models/user.model.js";
import asyncHandler from "../utilities/asyncHandler.utility.js";
import errorHandler from "../utilities/errorHandler.utility.js";
import { io, getSocketId } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.userId;
  const receiverId = req.params.receiverId;
  const message = req.body.message;

  if (!senderId || !receiverId || !message?.trim()) {
    return next(new errorHandler("All fields are required", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return next(new errorHandler("Invalid receiver ID", 400));
  }

  if (senderId.toString() === receiverId.toString()) {
    return next(new errorHandler("Cannot send message to yourself", 400));
  }

  const receiverExists = await userModel.exists({ _id: receiverId });
  if (!receiverExists) {
    return next(new errorHandler("Receiver not found", 404));
  }

  let conversation = await conversationModel.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await conversationModel.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = await messageModel.create({
    senderId,
    receiverId,
    message: message.trim(),
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }

  // Real-time socket delivery if receiver is online
  const socketId = getSocketId(receiverId);
  if (socketId) {
    io.to(socketId).emit("newMessage", newMessage);
  }

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

  if (!mongoose.Types.ObjectId.isValid(otherParticipantId)) {
    return next(new errorHandler("Invalid participant ID", 400));
  }

  const conversation = await conversationModel
    .findOne({
      participants: { $all: [myId, otherParticipantId] },
    })
    .populate("messages")
    .lean();

  if (!conversation) {
    return res.status(200).json({
      success: true,
      responseData: {
        conversation: {
          messages: [],
        },
      },
    });
  }

  const { createdAt, updatedAt, __v, ...filteredConversation } = conversation;

  res.status(200).json({
    success: true,
    responseData: {
      conversation: filteredConversation,
    },
  });
});
