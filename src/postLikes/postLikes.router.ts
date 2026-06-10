import { Router } from "express";
import { LikesController } from "./postLikes.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const likesRouter = Router()

likesRouter.get('/likes', LikesController.getAllLikes)
likesRouter.post('/posts/:postId/like', authMiddleware, LikesController.createLike)
likesRouter.delete('/posts/:postId/like', authMiddleware, LikesController.deleteLike)