import { ChatRepository } from './chat.repository'
import { IChatServiceContract } from './chat.types'

export const ChatService: IChatServiceContract = {
    getGroupChats: async(userId) => {
        const groupChats = await ChatRepository.getGroupChats(userId)
        return groupChats
    },

    getPersonalChats: async(userId) => {
        const personalChats = await ChatRepository.getPersonalChats(userId)
        return personalChats
    }
}