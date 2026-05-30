import { Request, Response } from "express"
import { AuthenticatedSocket, ServerSocket } from "../../socket/socket.types"
import { IMessage, IMessageCreate, IMessageCreateDTO, IMessageWithAuthor } from "./message.types"

export interface IMessageControllerContract {
    getMessages: (
        req: Request<{chatId: string}, IMessage[] | string, object>,
        res: Response<IMessage[] | string>
    ) => void
}

export interface IMessageServiceContract {
    getMessages: (chatId: number) => Promise<IMessage[]>
    getAllMessagesByChatId: (chatId: number) => Promise<IMessage[]>
    createMessage: (data: IMessageCreate) => Promise<IMessageWithAuthor>
}

export interface IMessageRepositoryContract {
    getMessages: (chatId: number) => Promise<IMessage[]>
    getAllMessagesByChatId: (chatId: number) => Promise<IMessage[]>
    createMessage: (data: IMessageCreate) => Promise<IMessageWithAuthor>
}

export interface IMessageSocketControllerContract {
    registerHandlers: (socketServer: ServerSocket, socket: AuthenticatedSocket) => void
    sendMessage: (socketServer: ServerSocket, socket: AuthenticatedSocket, data: IMessageCreateDTO) => void
    newMessage: (socketServer: ServerSocket, message: IMessageWithAuthor) => void
}