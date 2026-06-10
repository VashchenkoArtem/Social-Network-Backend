import { Router } from "express";
import { LikesController } from "./postLikes.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const likesRouter = Router()

likesRouter.get('/posts/:postId/likes', LikesController.getPostLikesCount)
likesRouter.get('/posts/:postId/like-status', authMiddleware, LikesController.getPostLikeStatus)
likesRouter.post('/posts/:postId/like', authMiddleware, LikesController.createLike)
likesRouter.delete('/posts/:postId/like', authMiddleware, LikesController.deleteLike)