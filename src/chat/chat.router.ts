import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ChatController } from "./chat.controller";
import { uploadMiddleware, procImgMiddleware } from "../middlewares/upload.middleware";


export const chatRouter = Router()

chatRouter.get("/personal-chats", authMiddleware, ChatController.getPersonalChats)
chatRouter.get("/group-chats", authMiddleware, ChatController.getGroupChats)
chatRouter.post(
    "/group-chats", 
    authMiddleware, 
    uploadMiddleware.array("avatar", 1), 
    procImgMiddleware(300, 100), 
    ChatController.createGroupChat
);