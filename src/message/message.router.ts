import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { MessageController } from "./message.controller";
import { procImgMiddleware, uploadMiddleware } from "../middlewares/upload.middleware";

export const messageRouter = Router()

messageRouter.get('/messages/chats/:chatId', authMiddleware, MessageController.getMessages)
messageRouter.get("/messages/unread", authMiddleware, MessageController.getAllUnreadMessages)
messageRouter.get("/messages/unreadChat", authMiddleware, MessageController.getAllUnreadChatMessages)
messageRouter.get("/messages/read/chat/:chatId", authMiddleware, MessageController.markAsRead) 
messageRouter.post("/messages/chat/:chatId", authMiddleware,uploadMiddleware.array("images", 7), procImgMiddleware(300, 100, "chat_app", "message_images"), MessageController.createMessage)