import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";


export type ChatWithUsers = Prisma.chat_app_chatGetPayload<{
    include: {
        users: {
            include: {
                user: {
                    include: {
                        profile: true
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

export interface IChatRepositoryContract {
    getGroupChats: (userId: number) => Promise<ChatWithUsers[]>;
    getPersonalChats: (userId: number) => Promise<ChatWithUsers[]>;
    createGroupChat: (adminId: number, data: ICreateGroupChatDto, filename: string | null) => Promise<ChatWithUsers>;
}

export interface IChatServiceContract {
    getGroupChats: (userId: number) => Promise<ChatWithUsers[]>;
    getPersonalChats: (userId: number) => Promise<ChatWithUsers[]>;
    createGroupChat: (adminId: number, data: ICreateGroupChatDto, filename: string | null) => Promise<ChatWithUsers>;
}

export interface IChatControllerContract {
    getGroupChats: (
        req: Request<object, ChatWithUsers[] | string, object>,
        res: Response<ChatWithUsers[] | string>
    ) => Promise<void>;
    
    getPersonalChats: (
        req: Request<object, ChatWithUsers[] | string, object>,
        res: Response<ChatWithUsers[] | string>
    ) => Promise<void>;

    createGroupChat: (
        req: Request<object, ChatWithUsers | string, { name: string; userIds: string | number[] }, object>,
        res: Response<ChatWithUsers | string>
    ) => Promise<void>;
}