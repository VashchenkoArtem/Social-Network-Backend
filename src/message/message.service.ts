import { MessageRepository } from "./message.repository"
import { IMessageServiceContract } from "./message.types"

export const MessageService: IMessageServiceContract = {
    getMessages: async (chatId) => {
        const messages = await MessageRepository.getMessages(chatId)
        return messages
    }
}