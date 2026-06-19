import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { postsController } from "./post.controller";
import { procImgMiddleware, uploadMiddleware } from "../middlewares/upload.middleware";

export const postRouter = Router();

postRouter.get("/posts", authMiddleware, postsController.getAllPosts)
postRouter.get("/posts/my", authMiddleware, postsController.getMyPosts)

postRouter.post(
    "/posts", 
    authMiddleware, 
    uploadMiddleware.array("images", 7), 
    procImgMiddleware(1080, 80, "post_app", "compressed_images"),
    postsController.createPost
)

postRouter.patch( 
    "/posts/:id", 
    authMiddleware, 
    uploadMiddleware.array("images", 7), 
    procImgMiddleware(1080, 80, "post_app", "compressed_images"),
    postsController.updatePost 
);

postRouter.delete( "/posts/:id", authMiddleware, postsController.deletePost );
postRouter.get("/users/:userId/posts", authMiddleware, postsController.getPostsByUserId)
postRouter.post("/posts/:id/view", authMiddleware, postsController.viewPost);