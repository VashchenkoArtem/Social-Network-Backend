import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { MessageController } from "./message.controller";

export const messageRouter = Router()

messageRouter.get('/messages/:chatId', authMiddleware, MessageController.getMessages)