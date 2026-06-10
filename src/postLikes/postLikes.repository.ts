import { IPostLikesRepositoryContract } from './postLikes.types'
import { client } from "../client/client";

export const LikesRepository: IPostLikesRepositoryContract = {
    getPostLikesCount: async (postId) => {
        try {
            const likesCount = await client.post_app_postlike.count({
                where: {
                    post_id: postId
                }
            })
            return likesCount
        } catch (error) {
            throw error
        }
    },

    getPostLikeStatus: async (postId, userId) => {
        try {
            const like = await client.post_app_postlike.findFirst({
                where: {
                    post_id: postId,
                    user_id: userId
                }
            })
            return !!like 
        } catch (error) {
            throw error
        }
    },

    createLike: async (postId, userId) => {
        try {
            const newLike = await client.post_app_postlike.create({
                data: {
                    post_id: postId,
                    user_id: userId
                }
            })
            return newLike
        } catch (error) {
            throw error
        }
    },

    deleteLike: async (postId, userId) => {
        try {
            const deletedLike = await client.post_app_postlike.delete({
                where: {
                    user_id_post_id: {
                        post_id: postId,
                        user_id: userId
                    }
                }
            })
            return deletedLike
        } catch (error) {
            throw error
        }
    }
}