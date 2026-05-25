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
    }
}