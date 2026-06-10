import { IPostHeartsServiceContract } from './postHearts.types'
import { HeartsRepository } from "./postHearts.repository";

export const HeartsService: IPostHeartsServiceContract = {
    getPostHearts: async (postId) => {
        const hearts = await HeartsRepository.getPostHearts(postId)        
        return hearts
    },

    getPostHeartStatus: async (postId, userId) => {
        const heartStatus = await HeartsRepository.getPostHeartStatus(postId, userId)
        return heartStatus
    },

    createHeart: async (postId, userId) => {
        const heart = await HeartsRepository.createHeart(postId, userId)
        return heart
    },

    deleteHeart: async (postId, userId) => {
        const deletedHeart = await HeartsRepository.deleteHeart(postId, userId)
        return deletedHeart
    }
}