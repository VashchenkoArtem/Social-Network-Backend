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
    
    getMyPosts: async (userId) => {
        const posts = await postRepository.getMyPosts(userId);
        return posts;
    },
    
    createPost: async (data, files) => {
        return await postRepository.createPost(data, files);
    },

    deletePost: async (postId: number) => {
        const deletedPost = await postRepository.deletePost(postId)
        return deletedPost
    },
    updatePost: async (postId: number, data: UpdatePostDto, files?: Express.Multer.File[]): Promise<Post | string> => {
        if (data?.title !== undefined && data.title.trim().length === 0) {
            return "Title cannot be empty";
        }

        return await postRepository.updatePost(postId, data, files);
    },

    // deletePost: async (postId: number): Promise<{ message: string } | string> => {
    //     return await postRepository.deletePost(postId);
    // }
}