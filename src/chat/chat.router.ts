import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ChatController } from "./chat.controller";


export const chatRouter = Router()

chatRouter.get("/personal-chats", authMiddleware, ChatController.getPersonalChats)
chatRouter.get("/group-chats", authMiddleware, ChatController.getGroupChats)
chatRouter.post("/", authMiddleware, ChatController.createChat)
chatRouter.patch("/:id", authMiddleware, ChatController.updateChat)
chatRouter.delete("/:id", authMiddleware, ChatController.deleteChat)
chatRouter.delete("/leave", authMiddleware, ChatController.leaveChat) 