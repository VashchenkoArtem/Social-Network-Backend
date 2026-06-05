import { NotFoundError } from "../errors";
import { MessageService } from "./message.service";
import { IMessageControllerContract } from "./message.types";


export const MessageController: IMessageControllerContract = {
    getMessages: async (req, res) => {
        const chatId = Number(req.params.chatId)
        const messages = await MessageService.getMessages(chatId)
        
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
        const data = {
            ...req.body,
            photos: files.map((file) => file.filename),
            created_at: new Date(Date.now()),
            sender_id: Number(userId)
        }
        const message = await MessageService.createMessage(data);

        res.json(message);
}
}       