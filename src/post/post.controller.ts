import { AlbumRepository } from "../album/album.repository";
import { AlbumService } from "../album/album.service";
import { PostService } from "./post.service";
import { IPostControllerContract } from "./post.types";

export const postsController: IPostControllerContract = {
    getAllPosts: async (req, res) => {
        const take = Number(req.query.take)

        if (Number.isNaN(take)) {
            res.status(400).json('Query param take must be a number')
            return
        }

        const response = await PostService.getAllPosts(take)
        res.status(200).json(response)
    },

    getMyPosts: async (req, res) => {
        const userId = res.locals.userId;
        const posts = await PostService.getMyPosts(userId)
        
        res.status(200).json(posts)
    },
    createPost: async (req, res) => {
        const userId = res.locals.userId;
        const data = req.body;

        const files = req.files as Express.Multer.File[];

        const dataWithId = {
            ...data,
            authorId: userId,
        };

        const createPost = await PostService.createPost(
            dataWithId,
            files
        );

        res.status(200).json(createPost);
    },
}