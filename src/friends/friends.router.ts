import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { friendController } from "./friends.controller";

export const friendRouter = Router()

friendRouter.get("/friends", authMiddleware, friendController.getAllFriends)

friendRouter.get("/requests", authMiddleware, friendController.getAllRequests)