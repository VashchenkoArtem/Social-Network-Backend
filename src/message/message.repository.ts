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
}