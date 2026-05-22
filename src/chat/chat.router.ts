import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ChatController } from "./chat.controller";


export const chatRouter = Router()

chatRouter.get("/personal-chats", authMiddleware, ChatController.getPersonalChats)
chatRouter.get("/group-chats", authMiddleware, ChatController.getGroupChats)