import { ChatService } from "./chat.service";
import { IChatControllerContract } from "./chat.types";


export const ChatController: IChatControllerContract = {
    getGroupChats: async (req, res) => {
        const userId = res.locals.userId
        const groupChats = await ChatService.getGroupChats(userId)

        res.status(200).json(groupChats)
    },
    getPersonalChats: async (req, res) => {
        const userId = res.locals.userId
        const personalChats = await ChatService.getPersonalChats(userId)

        res.status(200).json(personalChats)
    },
    createChat: async (req, res) => {
        const userId = res.locals.userId
        const body = req.body
        const chat = await ChatService.createChat(body, userId)
        res.status(201).json(chat)
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
}