import { BadRequestError, NotFoundError } from "../errors";
import { MessageService } from "./message.service";
import { IMessageControllerContract } from "./message.types";


export const MessageController: IMessageControllerContract = {
    getMessages: async (req, res) => {
        const chatId = Number(req.params.chatId)
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

        const messages = await MessageService.getMessages(chatId, paginationData)
        res.status(200).json(messages)
    },

    getAllUnreadMessages: async (req, res) => {
        const userId = res.locals.userId
        const is_group = req.query.is_group === "true"
        const unreadMessages = await MessageService.getAllUnreadMessages(userId, is_group)
        res.status(200).json(unreadMessages)
    },

    markAsRead: async (req, res) => {
        const chatId = Number(req.params.chatId)
        const userId = res.locals.userId
        const markedMessage = await MessageService.markAsRead(chatId, userId)
        console.log(markedMessage)
        res.status(200).json(markedMessage)
    },

    getAllUnreadChatMessages: async(req, res) => {
        const userId = Number(res.locals.userId)
        console.log(userId)
        const unreadChatMessages = await MessageService.getAllUnreadChatMessages(userId)
        res.status(200).json(unreadChatMessages)
    },
    createMessage: async (req, res) => {
        const files = req.files as Express.Multer.File[];
        const userId = res.locals.userId
        const chatId = req.params.chatId
        const body = req.body
        const data = {
            ...body,
            photos: files.map((file) => file.filename),
            created_at: new Date(Date.now()),
            sender_id: Number(userId),
            chat_id: Number(chatId)
        }
        const message = await MessageService.createMessage(data);

        res.json(message);
}
}       