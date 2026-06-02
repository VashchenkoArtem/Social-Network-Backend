import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { MessageController } from "./message.controller";

export const messageRouter = Router()

messageRouter.get('/messages/chats/:chatId', authMiddleware, MessageController.getMessages)
messageRouter.get("/messages/unread", authMiddleware, MessageController.getAllUnreadMessages)
messageRouter.post("/messages/unreadChat", authMiddleware, MessageController.getAllUnreadChatMessages)