import { BadRequestError } from "../errors";
import { ChatService } from "./chat.service";
import { IChatControllerContract } from "./types/chat.contracts";

export const ChatController: IChatControllerContract = {
    getGroupChats: async (req, res) => {
        try {
            const userId = res.locals.userId;
            const limit = Number(req.query.limit)
            const cursor = Number(req.query.cursor)
            if (cursor !== undefined && Number.isNaN(cursor)) {
                    throw new BadRequestError("Cursor must be an integer");
                }
                
            if (limit !== undefined && Number.isNaN(limit)) {
                throw new BadRequestError("Limit must be an integer");
            }

            const paginationData: {
                cursor?: number;
                limit?: number;
            } = {};
            if (cursor !== undefined) paginationData.cursor = cursor
            if (limit !== undefined) paginationData.limit = limit
            const chats = await ChatService.getGroupChats(userId, paginationData);
            res.status(200).json(chats);
        } catch (error) {
            res.status(500).json("Internal Server Error");
        }
    },

    getPersonalChats: async (req, res) => {
        try {
            const userId = res.locals.userId;
            const limit = Number(req.query.limit)
            const cursor = Number(req.query.cursor)
            if (cursor !== undefined && Number.isNaN(cursor)) {
                    throw new BadRequestError("Cursor must be an integer");
                }
                
            if (limit !== undefined && Number.isNaN(limit)) {
                throw new BadRequestError("Limit must be an integer");
            }

            const paginationData: {
                cursor?: number;
                limit?: number;
            } = {};
            if (cursor !== undefined) paginationData.cursor = cursor
            if (limit !== undefined) paginationData.limit = limit
            const chats = await ChatService.getPersonalChats(userId, paginationData);
            res.status(200).json(chats);
        } catch (error) {
            res.status(500).json("Internal Server Error");
        }
    },

    createChat: async (req, res) => {
        try {
            const adminId = Number(res.locals.userId);
            const { name, userIds, ...body } = req.body;
            const is_group = req.body.is_group === "true";
            console.log(is_group)
            let parsedUserIds: number[] = [];

            if (typeof userIds === "string") {
                const rawArray = JSON.parse(userIds);

                parsedUserIds = Array.isArray(rawArray)
                    ? rawArray.map(Number)
                    : [];
            } else if (Array.isArray(userIds)) {
                parsedUserIds = userIds.map(Number);
            }
            if (!is_group && parsedUserIds.length === 1) {
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
                    is_group: is_group || false,
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
        console.log(chat)
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
