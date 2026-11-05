import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";
import asyncHandler from "../utilities/asyncHandler.utility.js";
import errorHandler from "../utilities/errorHandler.utility.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { fullName, username, password, gender } = req.body;
  if (!fullName?.trim() || !username?.trim() || !password || !gender) {
    return next(new errorHandler("All fields are required", 400));
  }

  const trimmedUsername = username.trim();
  const trimmedFullName = fullName.trim();

  const user = await userModel.findOne({ username: trimmedUsername });
  if (user) {
    return next(new errorHandler("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    trimmedFullName
  )}&background=random&color=fff&bold=true`;
  const newUser = await userModel.create({
    username: trimmedUsername,
    fullName: trimmedFullName,
    password: hashedPassword,
    gender,
    avatar,
  });

  const tokenData = {
    _id: newUser?._id,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const { password: _, ...sanitizedUser } = newUser.toObject();

  const cookieExpiresDays = Number(process.env.COOKIE_EXPIRES) || 2;

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json({
      success: true,
      responseData: {
        user: sanitizedUser,
        token,
      },
    });
});

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  const trimmedUsername = username.trim();
  const user = await userModel.findOne({ username: trimmedUsername });
  if (!user) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  const tokenData = {
    _id: user?._id,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // Remove sensitive fields before sending response
  const { password: _, ...sanitizedUser } = user.toObject();

  const cookieExpiresDays = Number(process.env.COOKIE_EXPIRES) || 2;

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json({
      success: true,
      responseData: {
        user: sanitizedUser,
        token,
      },
    });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const profile = await userModel.findById(userId).select("-password");

  if (!profile) {
    return next(new errorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    responseData: profile,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getOtherUsers = asyncHandler(async (req, res, next) => {
  const senderId = req.userId;
  const otherUsers = await userModel
    .find({
      _id: { $ne: senderId },
    })
    .select("-password");

  res.status(200).json({
    success: true,
    responseData: {
      otherUsers,
    },
  });
});
