import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { postsController } from "./post.controller";

export const postRouter = Router();

postRouter.get("/posts", authMiddleware, postsController.getAllPosts)
postRouter.get("/posts/my", authMiddleware, postsController.getMyPosts)
postRouter.post("/posts", authMiddleware, postsController.createPost)