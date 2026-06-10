import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { HeartsController } from "./postHearts.controller";

export const heartsRouter = Router()

heartsRouter.get('/hearts', HeartsController.getAllHearts)
heartsRouter.post('/posts/:postId/heart', authMiddleware, HeartsController.createHeart)
heartsRouter.delete('/posts/:postId/heart', authMiddleware, HeartsController.deleteHeart)