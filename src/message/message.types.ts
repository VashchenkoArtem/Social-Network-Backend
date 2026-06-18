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
                profile_app_profile: {
                    select: {
                        id: true,
                        avatar: true,
                        pseudonym: true
                    }
                }
            } 
        }
}
}>
export type IMessageCreatePayload = IMessageWithAuthor

export interface IMessageCreate {
    text: string | null
    chat_id: number
    created_at: Date
    sender_id: number;
    photos?: string[]
}
export interface IMessageCreateBody {
    text: string;
    photos: string[]
}
export interface IMessageCreateDTO {
    text: string | null
    pseudonym: string,
    avatar: string
    photos?: string[]
}
export interface IMessageSocketCreateDTO extends IMessageCreateDTO {
    chat_id: number
}
export interface IMessageWithPaginationResponse {
    messages: IMessage[]
    meta: {
        nextCursor: number | null;
        hasMore: boolean;
    };
}

export interface IMessageQuery {
    limit?: string;
    cursor?: string;
}

export interface PaginationDTO {
    limit?: number;
    cursor?: number;
}

export interface IMessageControllerContract {
    getMessages: (
        req: Request<{chatId: string}, IMessageWithPaginationResponse | string, object, IMessageQuery>,
        res: Response<IMessageWithPaginationResponse | string>
    ) => void

    getAllUnreadMessages: (
        req: Request<object, number | string, object, {is_group?: string}>,
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
    createMessage: (
    req: Request<{chatId: string}, IMessageWithAuthor, IMessageCreateBody>,
    res: Response<IMessageWithAuthor | string>
    ) => void;
}

export interface IMessageServiceContract {
    getMessages: (chatId: number, paginationData: PaginationDTO) => Promise<IMessageWithPaginationResponse>
    getAllMessagesByChatId: (chatId: number) => Promise<IMessage[]>
    createMessage: (data: IMessageCreate) => Promise<IMessageWithAuthor>
    markAsRead: (chatId: number, userId: number) => Promise<string>
    getAllUnreadMessages: (userId: number, is_group: boolean) => Promise<number | string>
    getAllUnreadChatMessages: (userId: number) => Promise<number | string>
}

export interface IMessageRepositoryContract {
    getMessages: (chatId: number, paginationData: PaginationDTO) => Promise<IMessageWithPaginationResponse>
    getAllMessagesByChatId: (chatId: number) => Promise<IMessage[]>
    createMessage: (data: IMessageCreate) => Promise<IMessageWithAuthor>
    getAllUnreadMessages: (userId: number, is_group: boolean) => Promise<number | string>
    markAsRead: (chatId: number, userId: number) => Promise<string>
    getAllUnreadChatMessages: (userId: number) => Promise<number | string>
}


export interface IMessageSocketControllerContract {
    registerHandlers: (socketServer: ServerSocket, socket: AuthenticatedSocket) => void
    sendMessage: (
        socketServer: ServerSocket,
        socket: AuthenticatedSocket, 
        data: IMessageSocketCreateDTO, 
        ack?: IMessageCreatePayload
    ) => void
    newMessage: (socketServer: ServerSocket, message: IMessageWithAuthor) => void
}