import express from 'express'
import { getOtherUsers, getProfile, login, logout } from '../controllers/user.controller.js';
import { signup } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

//From "/api/v1/user"
userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/get-profile', isAuthenticated, getProfile)
userRouter.post('/logout', logout)
userRouter.get('/get-other-users', isAuthenticated, getOtherUsers)

export default userRouter