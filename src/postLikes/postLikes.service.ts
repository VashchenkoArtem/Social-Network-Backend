import { IPostLikesServiceContract } from './postLikes.types'
import { LikesRepository } from "./postLikes.repository";

export const LikesService: IPostLikesServiceContract = {
    getAllLikes: async () => {
        const likes = await LikesRepository.getAllLikes()
        if (!likes) {
            throw new Error('Likes was not found. Try again, please.')
        }
        return likes
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