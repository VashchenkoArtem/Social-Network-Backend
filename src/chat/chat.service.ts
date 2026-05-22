import { ChatRepository } from "./chat.repository";
import { IChatServiceContract } from "./chat.types";

export const ChatService: IChatServiceContract = {
    getGroupChats: async (userId) => {
        return await ChatRepository.getGroupChats(userId);
    },
    getPersonalChats: async (userId) => {
        return await ChatRepository.getPersonalChats(userId);
    },
    createGroupChat: async (adminId, data, filename) => {
        return await ChatRepository.createGroupChat(adminId, data, filename);
    }
};