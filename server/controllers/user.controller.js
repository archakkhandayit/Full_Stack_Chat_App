import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import userModel from "../models/user.model.js";
import asyncHandler from "../utilities/asyncHandler.utility.js";
import errorHandler from "../utilities/errorHandler.utility.js";

export const signup = asyncHandler(async (req,res,next) => {
        const { fullName, username, password, gender } = req.body;
        if( !fullName || !username || !password || !gender){
            return next(new errorHandler("All fields are required",400));
            }
        const user =await userModel.findOne({username});
        if(user){
            return next(new errorHandler("User already exists",400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const avatarType = gender === "male" ? "boy" : "girl";
        const avatar = `https://avatar.iran.liara.run/public/${avatarType}?username=${username}`
        const newUser = await userModel.create({
            username,
            fullName,
            plain_password: password,
            password: hashedPassword,
            gender,
            avatar
        })

        const tokenData = {
            _id: newUser?._id
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn : process.env.JWT_EXPIRES} )

        res
            .status(200)
            .cookie("token", token, {
                expires: new Date(
                    Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
            })
            .json({
                success: true,
                responseData: {
                    newUser,
                    token,
                }
            })
});

export const login = asyncHandler( async (req,res,next) => {
    const { username, password } = req.body;
    if( !username || !password ){
        return next(new errorHandler("Please enter a valid username or password",400));
        }
    const user =await userModel.findOne({username});
    if(!user){
        return next(new errorHandler("Please enter a valid username or password",400));
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        return next(new errorHandler("Please enter a valid username or password", 400));
    }

    const tokenData = {
        _id: user?._id
    }
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn : process.env.JWT_EXPIRES} )

    // Remove sensitive fields before sending response
    const { plain_password, password: _, ...sanitizedUser } = user.toObject();

    res
        .status(200)
        .cookie("token", token, {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
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
            }
        })
});

export const getProfile = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const profile = await userModel.findById(userId);

    if (!profile) {
        return next(new errorHandler("User not found", 404));
    }

    // Remove sensitive fields before sending response
    const { plain_password, password: _, ...sanitizedProfile } = profile.toObject();

    res.status(200).json({
        success: true,
        responseData: sanitizedProfile,
    });
});

export const logout = asyncHandler( async (req,res,next) => {
    res
        .status(200)
        .cookie("token", "", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        })
        .json({
            success: true,
            message: "Logged out successfully",
        })
});

export const getOtherUsers = asyncHandler( async (req,res,next) => {
    const senderId = req.userId;
    const otherUsers = await userModel.find({
        _id: { $ne: senderId}
    });

    const filteredUsers = otherUsers.map(
        ({ _id, fullName, username, gender, avatar }) => ({_id, fullName, username, gender, avatar})
    );

    res.status(200).json({
        success: true,
        responseData: {
            otherUsers: filteredUsers
        }
    })

    // Why sending all information of users to client. like passoword and timestamps of user's document?
    // Don't send!!!
    // res.status(200).json({
    //     success: true,
    //     responseData: {
    //         otherUsers,
    //     }
    // })

})
