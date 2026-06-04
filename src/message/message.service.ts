import { MessageRepository } from "./message.repository"
import { IMessageServiceContract } from "./message.types"

export const MessageService: IMessageServiceContract = {
    getMessages: async (chatId) => {
        const messages = await MessageRepository.getMessages(chatId)
        return messages
    },

    getAllMessagesByChatId: async(chatId) => {
        const allMessages = await MessageRepository.getAllMessagesByChatId(chatId)
        return allMessages
    },

    createMessage: async(data) => {
        const newMessage = await MessageRepository.createMessage(data)
        return newMessage
    },

    getAllUnreadMessages: async(userId) => {
        const unreadMessages = await MessageRepository.getAllUnreadMessages(userId)
        return unreadMessages
    },

    markAsRead: async(chatId, userId) => {
        const readStatus = await MessageRepository.markAsRead(chatId, userId)
        return readStatus
    },

    getAllUnreadChatMessages: async(userId) => {
        console.log(userId)
        const unreadChatMessages = await MessageRepository.getAllUnreadChatMessages(userId)
        return unreadChatMessages
    },
}