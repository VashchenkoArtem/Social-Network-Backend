import { Prisma } from '@prisma/client'
import type { Request, Response } from 'express'

export type IChat = Prisma.chat_app_chatGetPayload<{}>
export type IChatWithUsers = Prisma.chat_app_chatGetPayload<{
    include: {
        users: {
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profile: {
                            select: {
                                avatar: true
                            }
                        }
                    }
                }
            }
        }
    }
}>

export type ICreateChat = {
    name?: string;
    is_group: boolean;
    userIds: number[];
}

export type IUpdateChat = {
    name?: string;
}

export interface IChatControllerContract {
    getGroupChats: (
        req: Request<object, IChatWithUsers[] | string, object>, 
        res: Response<IChatWithUsers[] | string>
    ) => void
    getPersonalChats: (
        req: Request<object, IChatWithUsers[] | string, object>, 
        res: Response<IChatWithUsers[] | string>
    ) => void
    createChat: (
        req: Request<object, IChatWithUsers | string, ICreateChat>, 
        res: Response<IChatWithUsers | string>
    ) => void
    updateChat: (
        req: Request<{ id: string }, IChatWithUsers | string, IUpdateChat>, 
        res: Response<IChatWithUsers | string>
    ) => void
    deleteChat: (
        req: Request<{ id: string }, string, object>, 
        res: Response<string>
    ) => void
    leaveChat: (
        req: Request<object, string, object>, 
        res: Response<string>
    ) => void
}

export interface IChatServiceContract {
    getGroupChats: (userId: number) => Promise<IChatWithUsers[]>
    getPersonalChats: (userId: number) => Promise<IChatWithUsers[]>
    createChat: (data: ICreateChat, userId: number) => Promise<IChatWithUsers>
    updateChat: (chatId: number, data: IUpdateChat) => Promise<IChatWithUsers>
    deleteChat: (chatId: number) => Promise<void>
    leaveChat: (userId: number) => Promise<void>
}

export interface IChatRepositoryContract {
    getGroupChats: (userId: number) => Promise<IChatWithUsers[]>
    getPersonalChats: (userId: number) => Promise<IChatWithUsers[]>
    createChat: (data: ICreateChat, userId: number) => Promise<IChatWithUsers>
    updateChat: (chatId: number, data: IUpdateChat) => Promise<IChatWithUsers>
    deleteChat: (chatId: number) => Promise<void>
    leaveChat: (userId: number) => Promise<void>
}