import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ChatController } from "./chat.controller";
import { uploadMiddleware, procImgMiddleware } from "../middlewares/upload.middleware";

export const chatRouter = Router()

chatRouter.get("/personal-chats", authMiddleware, ChatController.getPersonalChats)
chatRouter.get("/group-chats", authMiddleware, ChatController.getGroupChats)

chatRouter.post(
    "/chat", 
    authMiddleware, 
    uploadMiddleware.array("avatar", 1), 
    procImgMiddleware(400, 85, "chat_app", "group_avatars"),
    ChatController.createChat
);

chatRouter.patch(
    "/chat/:id", 
    authMiddleware, 
    uploadMiddleware.array("avatar", 1), 
    procImgMiddleware(400, 85, "chat_app", "group_avatars"),
    ChatController.updateChat
)

chatRouter.delete("/group-chats/:id", authMiddleware, ChatController.deleteChat)
chatRouter.delete("/group-chats/:id/leave", authMiddleware, ChatController.leaveChat)
chatRouter.get('/chat/:chatId', authMiddleware, ChatController.findChatById)