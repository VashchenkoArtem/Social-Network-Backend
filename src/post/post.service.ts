import { postRepository } from "./post.repository";
import { IPostServiceContract, Post, UpdatePostDto } from "./post.types";

export const PostService: IPostServiceContract = {
    getAllPosts: async (take) => {
        
        const posts = await postRepository.getAllPosts(take)
        if (!posts) {
            throw new Error('Posts was not found. Try again, please.')
        }
        return posts
    },
    
    getMyPosts: async (userId, take) => {
        const posts = await postRepository.getMyPosts(userId, take);
        return posts;
    },
    
    createPost: async (data, files) => {
        return await postRepository.createPost(data, files);
    },

    deletePost: async (postId) => {
        const deletedPost = await postRepository.deletePost(postId)
        return deletedPost
    },
    updatePost: async (postId, data: UpdatePostDto, files?: Express.Multer.File[]): Promise<Post | string> => {
        if (data?.title !== undefined && data.title.trim().length === 0) {
            return "Title cannot be empty";
        }

        return await postRepository.updatePost(postId, data, files);
    },
    getPostsByUserId: async (userId) => {
        const foundedPosts = await postRepository.getPostsByUserId(userId)
        return foundedPosts
    },
    // deletePost: async (postId: number): Promise<{ message: string } | string> => {
    //     return await postRepository.deletePost(postId);
    // }

    viewPost: async(postId, userId) => {
        return await postRepository.viewPost(postId, userId)
    },
}