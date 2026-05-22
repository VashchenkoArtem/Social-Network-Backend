import { MessageService } from "./message.service";
import { IMessageControllerContract } from "./message.types";


export const MessageController: IMessageControllerContract = {
    getMessages: async (req, res) => {
        const chatId = Number(req.params.chatId)
        const messages = await MessageService.getMessages(chatId)
        
        res.status(200).json(messages)
    }
}       