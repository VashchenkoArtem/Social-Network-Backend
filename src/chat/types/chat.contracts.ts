import type { Request, Response } from "express";
import { IChatParticipant, IChatWithUsers, ICreateGroupChatDto, IUpdateChat } from "./chat.types";

export interface IChatControllerContract {
    getGroupChats: (
        req: Request<
            object,
            IChatWithUsers[] | string,
            object
        >,
        res: Response<
            IChatWithUsers[] | string
        >
    ) => Promise<void>;

    getPersonalChats: (
        req: Request<
            object,
            IChatWithUsers[] | string,
            object
        >,
        res: Response<
            IChatWithUsers[] | string
        >
    ) => Promise<void>;

    updateChat: (
        req: Request<
            { id: string },
            IChatWithUsers | string,
            IUpdateChat
        >,
        res: Response<
            IChatWithUsers | string
        >
    ) => Promise<void>;

    deleteChat: (
        req: Request<
            { id: string },
            string,
            object
        >,
        res: Response<
            string
        >
    ) => Promise<void>;

    leaveChat: (
        req: Request<
            object,
            string,
            object
        >,
        res: Response<
            string
        >
    ) => Promise<void>;

    createGroupChat: (
        req: Request<
            object,
            IChatWithUsers | string,
            {
                name: string;
                userIds: string | number[];
            }
        >,
        res: Response<
            IChatWithUsers | string
        >
    ) => Promise<void>;

    findChatById: (
        req: Request<
            { chatId: string },
            IChatWithUsers | string,
            object,
            object
        >,
        res: Response<
            IChatWithUsers | string
        >
    ) => Promise<void>;
}

export interface IChatServiceContract {
    getGroupChats: (
        userId: number
    ) => Promise<IChatWithUsers[]>;

    getPersonalChats: (
        userId: number
    ) => Promise<IChatWithUsers[]>;

    createGroupChat: (
        adminId: number,
        data: ICreateGroupChatDto,
        filename: string | null
    ) => Promise<IChatWithUsers>;

    updateChat: (
        chatId: number,
        data: IUpdateChat
    ) => Promise<IChatWithUsers>;

    deleteChat: (
        chatId: number
    ) => Promise<void>;

    leaveChat: (
        userId: number
    ) => Promise<void>;

    findChatById: (
        chatId: number
    ) => Promise<IChatWithUsers | null>;

    isUserChatParticipant: (
        chatId: number,
        userId: number
    ) => Promise<boolean>;
}

export interface IChatRepositoryContract {
    getGroupChats: (
        userId: number
    ) => Promise<IChatWithUsers[]>;

    getPersonalChats: (
        userId: number
    ) => Promise<IChatWithUsers[]>;

    createGroupChat: (
        adminId: number,
        data: ICreateGroupChatDto,
        filename: string | null
    ) => Promise<IChatWithUsers>;

    updateChat: (
        chatId: number,
        data: IUpdateChat
    ) => Promise<IChatWithUsers>;

    deleteChat: (
        chatId: number
    ) => Promise<void>;

    leaveChat: (
        userId: number
    ) => Promise<void>;

    findChatById: (
        chatId: number
    ) => Promise<IChatWithUsers | null>;

    getChatParticipants: (
        chatId: number
    ) => Promise<IChatParticipant | null>;
}