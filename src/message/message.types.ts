import { Prisma } from "@prisma/client"
import type { Request, Response } from "express"
import { PageNumberCounters, PageNumberPagination } from "prisma-extension-pagination/dist/types"
import { AuthenticatedSocket, ServerSocket } from "../socket/socket.types"

export type IMessage = Prisma.chat_app_messageGetPayload<{}>
export type IMessageWithAuthor = Prisma.chat_app_messageGetPayload<{
    include: {
        id: true,
        user_app_user: {
            select: {
                id: true,
                username: true,
                profile_app_profile: {
                    select: {
                        id: true,
                        avatar: true
                    }
                }
            } 
        }
}
}>
export interface IMessageCreate {
    text: string | null
    created_at: Date
    chat_id: number
    sender_id: number
}
export interface IMessageCreateDTO {
    text: string | null
    chat_id: number,
    username: string,
    avatar: string
}

export interface IMessageWithPagination {
    messages: IMessage[]
    pagination: PageNumberPagination & PageNumberCounters
}


export interface IMessageControllerContract {
    getMessages: (
        req: Request<{chatId: string}, IMessage[] | string, object>,
        res: Response<IMessage[] | string>
    ) => void

    getAllUnreadMessages: (
        req: Request<object, number | string, object>,
        res: Response<number | string>
    ) => void
    
    markAsRead: (
        req: Request<{chatId: string}, IMessage | string, object>,
        res: Response<IMessage | string>
    ) => void

    getAllUnreadChatMessages: (
        req: Request<{chatId: string}, number | string, { chatId: number}[]>,
        res: Response<number | string>
    ) => void
}

export interface IMessageServiceContract {
    getMessages: (chatId: number) => Promise<IMessage[]>
    getAllMessagesByChatId: (chatId: number) => Promise<IMessage[]>
    createMessage: (data: IMessageCreate) => Promise<IMessageWithAuthor>
    markAsRead: (chatId: number, userId: number) => Promise<string>
    getAllUnreadMessages: (userId: number) => Promise<number | string>
    getAllUnreadChatMessages: (chatId: number, userId: number) => Promise<number | string>
}

export interface IMessageRepositoryContract {
    getMessages: (chatId: number) => Promise<IMessage[]>
    getAllMessagesByChatId: (chatId: number) => Promise<IMessage[]>
    createMessage: (data: IMessageCreate) => Promise<IMessageWithAuthor>
    getAllUnreadMessages: (userId: number) => Promise<number | string>
    markAsRead: (chatId: number, userId: number) => Promise<string>
    getAllUnreadChatMessages: (chatId: number, userId: number) => Promise<number | string>
}


export interface IMessageSocketControllerContract {
    registerHandlers: (socketServer: ServerSocket, socket: AuthenticatedSocket) => void
    sendMessage: (socketServer: ServerSocket, socket: AuthenticatedSocket, data: IMessageCreateDTO) => void
    newMessage: (socketServer: ServerSocket, message: IMessageWithAuthor) => void
}