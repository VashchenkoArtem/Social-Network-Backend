import { IPostLikesRepositoryContract } from './postLikes.types'
import { client } from "../client/client";

export const LikesRepository: IPostLikesRepositoryContract = {
    getAllLikes: async () => {
        try {
            const likes = await client.post_app_postlike.findMany()
            return likes
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