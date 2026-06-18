import { AlbumRepository } from "../album/album.repository";
import { AlbumService } from "../album/album.service";
import { PostService } from "./post.service";
import { 
    IPostControllerContract, 
    Post, 
    UpdatePostDto, 
    PostParams, 
    CreatePost } from "./post.types";

export const postsController: IPostControllerContract = {
    getAllPosts: async (req, res) => {
        const limit = Number(req.query.limit)
        const cursor = Number(req.query.cursor)
        if (Number.isNaN(limit)) {
            res.status(400).json('Query param take must be a number')
            return
        }

        const response = await PostService.getAllPosts({ limit, cursor})
        res.status(200).json(response)
    },
    getMyPosts: async (req, res) => {
        const limit = Number(req.query.limit)
        const cursor = Number(req.query.cursor)

        if (Number.isNaN(limit)) {
            res.status(400).json('Query param take must be a number')
            return
        }

        const userId = res.locals.userId;
        const posts = await PostService.getMyPosts(userId, {limit, cursor})
        
        res.status(200).json(posts)
    },
    createPost: async (req, res) => {
        const userId = res.locals.userId;
        const data = req.body;
        const files = req.files as Express.Multer.File[];

        const dataWithId = {
            ...data,
            author_id: userId,
        };

        const createPost = await PostService.createPost(
            dataWithId,
            files
        );

        res.status(200).json(createPost);
    },
    updatePost: async (req, res) => {
        try {
            const postId = Number(req.params.id);
            if (isNaN(postId)) {
                res.status(400).json('Invalid Post ID');
                return;
            }

            const files = req.files as Express.Multer.File[];

            const response = await PostService.updatePost(BigInt(postId), req.body, files);

            if (typeof response === "string") {
                const status = response === "Post not found" ? 404 : 400;
                res.status(status).json(response);
                return;
            }

            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json("Internal Server Error");
        }
    },
    deletePost: async (req, res) => {
        try {
            const postId = Number(req.params.id);

            if (isNaN(postId)) {
                res.status(400).json('Invalid Post ID');
                return;
            }

            const response = await PostService.deletePost(BigInt(postId));

            if (typeof response === "string") {
                res.status(400).json(response);
                return;
            }

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json("Internal Server Error");
        }
    },
    getPostsByUserId: async (req, res) => {
        const userId = Number(req.params.userId)
        const foundedPosts = await PostService.getPostsByUserId(BigInt(userId))
        res.status(200).json(foundedPosts)
    },

    viewPost: async (req, res) => {
        try {
            const postId = Number(req.params.id);
            const userId = res.locals.userId;

            if (isNaN(postId)) {
                res.status(400).json('Invalid Post ID');
                return;
            }

            if (!userId) {
                res.status(401).json('Unauthorized');
                return;
            }

            const response = await PostService.viewPost(BigInt(postId), BigInt(userId));
            
            res.status(200).json(response);
        } catch (error) {
            console.error("Controller Error (viewPost):", error);
            res.status(500).json("Internal Server Error");
        }
    },
}