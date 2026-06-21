import { NotFoundError } from "../errors";
import { ChatRepository } from "./chat.repository";
import { IChatServiceContract } from "./types/chat.contracts";

export const ChatService: IChatServiceContract = {
    getGroupChats: async (userId, take) => {
        return await ChatRepository.getGroupChats(userId, take);
    },
    getPersonalChats: async (userId, take) => {
        return await ChatRepository.getPersonalChats(userId, take);
    },
    createChat: async (adminId, data, filename) => {
        return await ChatRepository.createChat(adminId, data, filename);
    },

    updateChat: async (chatId, data, filename) => {
        return await ChatRepository.updateChat(chatId, data, filename)
    },
    
    deleteChat: async (chatId) => {
        await ChatRepository.deleteChat(chatId)
    },
    
    leaveChat: async (userId, chatId) => {
        await ChatRepository.leaveChat(userId, chatId)
    },

    findChatById: async (chatId) => {
        return await ChatRepository.findChatById(chatId)
    },
    isUserChatParticipant: async (chatId, userId) => {
		const chat = await ChatRepository.getChatParticipants(chatId);
		if (!chat) {
			throw new NotFoundError("Chat");
		}
		const isUserInChat = chat.chat_app_chat_users.some((participant) => {
			return participant.user_app_user.id === BigInt(userId);
		});
		return isUserInChat;
	},
    getChatByParticipants: async (userId, participantId) => {
        return await ChatRepository.getChatByParticipants(userId, participantId)
    },
    getChatParticipants: async (chatId) => {
        return await ChatRepository.getChatParticipants(chatId)
    }
    
}
