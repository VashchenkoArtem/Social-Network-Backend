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
    }
}