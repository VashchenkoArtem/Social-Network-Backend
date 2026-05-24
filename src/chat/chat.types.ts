import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";


export type IChatWithUsers = Prisma.chat_app_chatGetPayload<{
    include: {
        chat_app_chat_users: {
            include: {
                user_app_user: {
                    include: {
                        profile_app_profile: true
                    }
                }
            }
        }
    }
}>;

export interface ICreateGroupChatDto {
    name: string;
    userIds: number[];
}

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
    createGroupChat: (
        req: Request<object, IChatWithUsers | string, { name: string; userIds: string | number[] }, object>,
        res: Response<IChatWithUsers | string>
    ) => Promise<void>;
    findChatById: (
        req: Request<{chatId: string}, IChatWithUsers | string, object, object>,
        res: Response<IChatWithUsers | string>
    ) => Promise<void>
}

export interface IChatServiceContract {
    getGroupChats: (userId: number) => Promise<IChatWithUsers[]>
    getPersonalChats: (userId: number) => Promise<IChatWithUsers[]>
    createGroupChat: (adminId: number, data: ICreateGroupChatDto, filename: string | null) => Promise<IChatWithUsers>;
    updateChat: (chatId: number, data: IUpdateChat) => Promise<IChatWithUsers>
    deleteChat: (chatId: number) => Promise<void>
    leaveChat: (userId: number) => Promise<void>
    findChatById: (chatId: number) => Promise<IChatWithUsers | null>
}

export interface IChatRepositoryContract {
    getGroupChats: (userId: number) => Promise<IChatWithUsers[]>
    getPersonalChats: (userId: number) => Promise<IChatWithUsers[]>
    createGroupChat: (adminId: number, data: ICreateGroupChatDto, filename: string | null) => Promise<IChatWithUsers>;
    updateChat: (chatId: number, data: IUpdateChat) => Promise<IChatWithUsers>
    deleteChat: (chatId: number) => Promise<void>
    leaveChat: (userId: number) => Promise<void>
    findChatById: (chatId: number) => Promise<IChatWithUsers | null>
}