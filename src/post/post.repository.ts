import { IPostRepositoryContract } from "./post.types";
import { client } from "../client/client";

export const postRepository: IPostRepositoryContract = {
    getAllPosts: async (take) => {
        try  {
            const posts = await client.post.findMany({
                take: take !== undefined ? take : 5,

                include: {
                    author: {
                        include: {
                            avatars: true
                        }
                    },
                    urls: true,
                    photos: true,
                    tags: true
                }
            })
            return posts
        } catch (error) {
            throw error
        }
    },
    
    getMyPosts: async (userId) => {
        try {
            return await client.post.findMany({
                where: {
                    authorId: userId
                },
                include: {
                    author: {
                        include: {
                            avatars: true
                        }
                    },
                    urls: true,
                    photos: true,
                    tags: true
                }
            })
        } catch (error) {
            throw error
        }
    },
    
    createPost: async (data) => {
        try {
            const newPost = await client.post.create({
                data: data,
                include: {
                    author: {
                        include: {
                            avatars: true
                        }
                    },
                    urls: true,
                    photos: true,
                    tags: true
                }
            })
            return newPost
        } catch (error) {
            throw error
        }
    }
}