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
        const unreadMessages = await MessageService.getAllUnreadMessages(userId)
        res.status(200).json(unreadMessages)
    },

    markAsRead: async (req, res) => {
        const chatId = Number(req.params.chatId)
        const userId = res.locals.userId
        const markedMessage = await MessageService.markAsRead(chatId, userId)
        res.status(200).json(markedMessage)
    },

    getAllUnreadChatMessages: async(req, res) => {
        const chatId = req.body[0]?.chatId
        if (!chatId){
            throw new NotFoundError("Chat id")
        }
        const userId = Number(res.locals.userId)
        console.log(userId)
        const unreadChatMessages = await MessageService.getAllUnreadChatMessages(chatId, userId)
        res.status(200).json(unreadChatMessages)
    },
}       