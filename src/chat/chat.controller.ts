import { ChatService } from "./chat.service";
import { IChatControllerContract } from "./types/chat.contracts";

export const ChatController: IChatControllerContract = {
    getGroupChats: async (req, res) => {
        try {
            const userId = res.locals.userId;
            const chats = await ChatService.getGroupChats(userId);
            res.status(200).json(chats);
        } catch (error) {
            res.status(500).json("Internal Server Error");
        }
    },

    getPersonalChats: async (req, res) => {
        try {
            const userId = res.locals.userId;
            const chats = await ChatService.getPersonalChats(userId);
            res.status(200).json(chats);
        } catch (error) {
            res.status(500).json("Internal Server Error");
        }
    },

    createChat: async (req, res) => {
        try {
            const adminId = Number(res.locals.userId);
            const { name, userIds, isGroup } = req.body;

            let parsedUserIds: number[] = [];

            if (typeof userIds === "string") {
                const rawArray = JSON.parse(userIds);

                parsedUserIds = Array.isArray(rawArray)
                    ? rawArray.map(Number)
                    : [];
            } else if (Array.isArray(userIds)) {
                parsedUserIds = userIds.map(Number);
            }
            if (!isGroup && parsedUserIds.length === 1) {
                const participantId = parsedUserIds[0]!;

                const existingChat =
                    await ChatService.getChatByParticipants(
                        adminId,
                        participantId
                    );

                if (existingChat) {
                    res.status(200).json(existingChat);
                    return
                }
            }

            const files = req.files as Express.Multer.File[];
            const filename = files?.[0]?.filename || null;

            const newChat = await ChatService.createChat(
                adminId,
                {
                    name,
                    userIds: parsedUserIds,
                    isGroup: isGroup || false,
                },
                filename
            );

            res.status(200).json(newChat);
        } catch (error) {
            console.log(error);
            res.status(500).json("Internal Server Error");
        }
    },
    updateChat: async (req, res) => {
        const chatId = Number(req.params.id)
        const body = req.body
        const chat = await ChatService.updateChat(chatId, body)
        res.status(200).json(chat)
    },
    deleteChat: async (req, res) => {
        const chatId = Number(req.params.id)
        await ChatService.deleteChat(chatId)
        res.status(200).json("Chat deleted")
    },
    leaveChat: async (req, res) => {
        const userId = res.locals.userId
        await ChatService.leaveChat(userId)
        res.status(200).json("Left chat")
    },
    findChatById: async (req, res) => {
        const chatId = Number(req.params.chatId)
        const chat = await ChatService.findChatById(chatId)
        if (!chat) {
            res.status(404).json("Chat not found")
            return
        }
        res.status(200).json(chat)
    }

}
