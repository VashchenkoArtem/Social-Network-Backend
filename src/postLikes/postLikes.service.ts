import { IPostLikesServiceContract } from './postLikes.types'
import { LikesRepository } from "./postLikes.repository";

export const LikesService: IPostLikesServiceContract = {
    getPostLikesCount: async (postId) => {
        const likesCount = await LikesRepository.getPostLikesCount(postId)
        return likesCount
    },

    createLike: async (postId, userId) => {
        const like = await LikesRepository.createLike(postId, userId)
        return like
    },

    deleteLike: async (postId, userId) => {
        const deletedLike = await LikesRepository.deleteLike(postId, userId)
        return deletedLike
    }
}