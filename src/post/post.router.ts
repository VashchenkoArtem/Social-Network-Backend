import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { postsController } from "./post.controller";
import { procImgMiddleware, uploadMiddleware } from "../middlewares/upload.middleware";

export const postRouter = Router();

postRouter.get("/posts", authMiddleware, postsController.getAllPosts)
postRouter.get("/posts/my", authMiddleware, postsController.getMyPosts)
postRouter.post("/posts", authMiddleware, uploadMiddleware.array("images", 9), procImgMiddleware(300, 100),  postsController.createPost)