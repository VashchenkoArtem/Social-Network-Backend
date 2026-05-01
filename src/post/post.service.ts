import { postRepository } from "./post.repository";
import { IPostServiceContract } from "./post.types";

export const PostService: IPostServiceContract = {
    getAllPosts: async (take) => {
        const posts = await postRepository.getAllPosts(take)
        if (!posts) {
            throw new Error('Posts was not found. Try again, please.')
        }
        return posts
    },
    
    getMyPosts: async (userId) => {
        const posts = await postRepository.getMyPosts(userId);
        return posts;
    },
    
    createPost: async (data, files) => {
        return await postRepository.createPost(data, files);
    },
}