import { client } from "../client/client";
import { IMessageRepositoryContract } from "./message.types";

export const MessageRepository: IMessageRepositoryContract = {
    getMessages: async (chatId) => {
        try {
            const messages = await client.chat_app_message.findMany({
                where: {
                    chat_id: chatId
                }
            })
            return messages
        } catch (error) {
            throw error
        }
    },

    getAllMessagesByChatId: async(chatId) => {
        try {
            const messages = await client.chat_app_message.findMany({
                where: {
                    chat_id: chatId
                },
            })

            return messages
        } catch (error) {
            throw error
        }
    },

    createMessage: async (data) => {
        try {
            const newMessage = await client.chat_app_message.create({
                data
            })
            return newMessage
        } catch (error) {
            throw error
        }
    }
}