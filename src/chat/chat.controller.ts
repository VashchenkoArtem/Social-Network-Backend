import { BadRequestError } from "../errors";
import { ChatService } from "./chat.service";
import { IChatControllerContract } from "./types/chat.contracts";

export const ChatController: IChatControllerContract = {
    getGroupChats: async (req, res) => {
        const limit = Number(req.query.limit)
        const cursor = Number(req.query.cursor)

        if (Number.isNaN(limit)) {
            res.status(400).json('Query param limit must be a number')
            return
        }

        const userId = res.locals.userId

        const response = await ChatService.getGroupChats(userId, {
            limit,
            cursor
        })

        res.status(200).json(response)
    },

    getPersonalChats: async (req, res) => {
        const limit = Number(req.query.limit)
        const cursor = Number(req.query.cursor)

        if (Number.isNaN(limit)) {
            res.status(400).json('Query param limit must be a number')
            return
        }

        const userId = res.locals.userId

        const response = await ChatService.getPersonalChats(userId, {
            limit,
            cursor
        })

        res.status(200).json(response)
    },

    createChat: async (req, res) => {
        try {
            const adminId = Number(res.locals.userId);
            const { name, userIds, ...body } = req.body;
            const is_group = req.body.is_group === "true";
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
        const data = { 
            name: body.name,
            userIds: body.userIds
        }
        const files = req.files as Express.Multer.File[];
        const filename = files?.[0]?.filename || null;
        const chat = await ChatService.updateChat(chatId, data, filename)
        res.status(200).json(chat)
    },
    deleteChat: async (req, res) => {
        try {
            const chatId = Number(req.params.id);
            const currentUserId = Number(res.locals.userId);
            if (Number.isNaN(chatId)) {
                res.status(400).json("Invalid chat id");
                return;
            }

            const chat = await ChatService.findChatById(chatId);
            
            if (!chat) {
                res.status(404).json("Chat not found");
                return;
            }

            if (Number(chat.admin_id) !== currentUserId) {
                res.status(403).json("You are not the owner of this chat");
                return;
            }

            await ChatService.deleteChat(chatId);
            res.status(200).json("Chat deleted");
        } catch (error) {
            console.error(error);
            res.status(500).json("Internal Server Error");
        }
    },
    leaveChat: async (req, res) => {
        const userId = Number(res.locals.userId);
        const chatId = Number(req.params.id);
        
        if (Number.isNaN(chatId)) {
            res.status(400).json("Invalid chat id");
            return;
        }

        await ChatService.leaveChat(userId, chatId);
        res.status(200).json("Left chat");
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
