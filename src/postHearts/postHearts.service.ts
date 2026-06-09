import { IPostHeartsServiceContract } from './postHearts.types'
import { HeartsRepository } from "./postHearts.repository";

export const HeartsService: IPostHeartsServiceContract = {
    getAllHearts: async () => {
        const hearts = await HeartsRepository.getAllHearts()
        if (!hearts) {
            throw new Error('Hearts was not found. Try again, please.')
        }
        return hearts
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