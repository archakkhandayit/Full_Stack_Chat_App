import jwt from "jsonwebtoken";

import asyncHandler from "../utilities/asyncHandler.utility.js";
import errorHandler from "../utilities/errorHandler.utility.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;
  const token = req.cookies?.token || bearerToken;

  if (!token) {
    return next(new errorHandler("Authentication required", 401));
  }

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = tokenData._id;
    next();
  } catch (err) {
    return next(new errorHandler("Invalid or expired token", 401));
  }
});
