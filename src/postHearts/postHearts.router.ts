import { Router } from "express";
import { HeartsController } from "./posthearts.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const heartsRouter = Router()

heartsRouter.get('/hearts', heartsController.getAllHearts)
heartsRouter.post('/posts/:postId/heart', authMiddleware, heartsController.createHeart)
heartsRouter.delete('/posts/:postId/heart', authMiddleware, heartsController.deleteHeart)