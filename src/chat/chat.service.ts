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
    },

    createChat: async (data, userId) => {
        return await ChatRepository.createChat(data, userId)
    },
    
    updateChat: async (chatId, data) => {
        return await ChatRepository.updateChat(chatId, data)
    },
    
    deleteChat: async (chatId) => {
        await ChatRepository.deleteChat(chatId)
    },
    
    leaveChat: async (userId) => {
        await ChatRepository.leaveChat(userId)
    },
}