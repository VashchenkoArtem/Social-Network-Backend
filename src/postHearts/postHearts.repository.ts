import { IPostHeartsRepositoryContract } from './postHearts.types'
import { client } from "../client/client";

export const HeartsRepository: IPostHeartsRepositoryContract = {
    getPostHearts: async (postId) => {
        try {
            const hearts = await client.post_app_postheart.count({
                where: {
                    post_id: postId
                }
            })
            return hearts
        } catch (error) {
            throw error
        }
    },

    getPostHeartStatus: async (postId, userId) => {
        try {
            const heart = await client.post_app_postheart.findFirst({
                where: {
                    post_id: postId,
                    user_id: userId
                }
            })
            return !!heart
        } catch (error) {
            throw error
        }
    },

    createHeart: async (postId, userId) => {
        try {
            const newHeart = await client.post_app_postheart.create({
                data: {
                    post_id: postId,
                    user_id: userId
                }
            })
            return newHeart
        } catch (error) {
            throw error
        }
    },

    deleteHeart: async (postId, userId) => {
        try {
            const deletedHeart = await client.post_app_postheart.delete({
                where: {
                    user_id_post_id: {
                        post_id: postId,
                        user_id: userId
                    }
                }
            })
            return deletedHeart
        } catch (error) {
            throw error
        }
    }
}