import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { MessageController } from "./message.controller";

export const messageRouter = Router()

messageRouter.get('/messages/chats/:chatId', authMiddleware, MessageController.getMessages)
messageRouter.get("/messages/unread", authMiddleware, MessageController.getAllUnreadMessages)
messageRouter.get("/messages/unreadChat", authMiddleware, MessageController.getAllUnreadChatMessages)
messageRouter.get("/messages/read/chat/:chatId", authMiddleware, MessageController.markAsRead)