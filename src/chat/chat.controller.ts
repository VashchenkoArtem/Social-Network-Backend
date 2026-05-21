import { ChatService } from "./chat.service";
import { IChatControllerContract } from "./chat.types";

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

    createGroupChat: async (req, res) => {
        try {
            const adminId = Number(res.locals.userId);
            const { name, userIds } = req.body;

            let parsedUserIds: number[] = [];
            if (typeof userIds === "string") {
                const rawArray = JSON.parse(userIds);
                parsedUserIds = Array.isArray(rawArray) ? rawArray.map(Number) : [];
            } else if (Array.isArray(userIds)) {
                parsedUserIds = userIds.map(Number);
            }

            const files = req.files as Express.Multer.File[];
            const filename = files?.[0]?.filename || null;

            const newChat = await ChatService.createGroupChat(
                adminId, 
                { name, userIds: parsedUserIds },
                filename
            );

            res.status(200).json(newChat);
        } catch (error) {
            res.status(500).json("Internal Server Error");
        }
    }
};