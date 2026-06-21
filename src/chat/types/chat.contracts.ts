import type { NextFunction, Request, Response } from "express";
import { ChatParticipants, CreateChat, IChat, IChatParticipant, IChatQuery, IChatWithPaginationResponse, IChatWithUsers, ICreateGroupChatDto, IUpdateChat, JoinChatCallback, JoinChatPayload, LeaveChatPayload, PaginationDTO } from "./chat.types";
import { AuthenticatedSocket } from "../../socket/socket.types";

export interface IChatControllerContract {
    getGroupChats: (
        req: Request<
            object,
            IChatWithPaginationResponse | string,
            object,
            IChatQuery
        >,
        res: Response<
            IChatWithPaginationResponse | string
        >
    ) => Promise<void>;

    getPersonalChats: (
        req: Request<
            object,
            IChatWithPaginationResponse | string,
            object,
            IChatQuery
        >,
        res: Response<
            IChatWithPaginationResponse | string
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
            {id: string},
            string,
            object
        >,
        res: Response<
            string
        >
    ) => Promise<void>;

    createChat: (
        req: Request<
            object,
            IChatWithUsers | string,
            ICreateGroupChatDto
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




    // getChats: (
	// 	req: Request<object, IChatWithUsers[] | string, object, object, { userId: number }>,
	// 	res: Response<IChatWithUsers[] | string>,
	// 	next: NextFunction,
	// ) => void;
	// createChat: (
	// 	req: Request<object, IChat | string, CreateChat, {participantId: string} , { userId: number}>,
	// 	res: Response<IChat | string>,
	// 	next: NextFunction
	// ) => void
}

export interface IChatServiceContract {
    getGroupChats: (
        userId: number,
        paginationData: PaginationDTO
    ) => Promise<IChatWithPaginationResponse>;

    getPersonalChats: (
        userId: number,
        paginationData: PaginationDTO
    ) => Promise<IChatWithPaginationResponse>;

    createChat: (
        adminId: number,
        data: {name: string, userIds: number[], is_group: boolean},
        filename: string | null
    ) => Promise<IChatWithUsers>;

    updateChat: (
        chatId: number,
        data: IUpdateChat,
        filename: string | null
    ) => Promise<IChatWithUsers>;

    deleteChat: (
        chatId: number
    ) => Promise<void>;

    leaveChat: (
        userId: number,
        chatId: number
    ) => Promise<void>;

    findChatById: (
        chatId: number
    ) => Promise<IChatWithUsers | null>;

    isUserChatParticipant: (
        chatId: number,
        userId: number
    ) => Promise<boolean>;
    getChatByParticipants: (
        userId: number,
        participantId: number,
    ) => Promise<IChatWithUsers | null>;
    getChatParticipants: (
        chatId: number,
    ) => Promise<ChatParticipants | null>
    



    // getAllWithChatParticipantInfo: (
    //     userId: number
    // ) => Promise<IChatWithUsers[]>;
}

export interface IChatRepositoryContract {
    getGroupChats: (
        userId: number,
        paginationData: PaginationDTO
    ) => Promise<IChatWithPaginationResponse>;

    getPersonalChats: (
        userId: number,
        paginationData: PaginationDTO
    ) => Promise<IChatWithPaginationResponse>;

    createChat: (
        adminId: number,
        data: {name: string, userIds: number[], is_group: boolean},
        filename: string | null
    ) => Promise<IChatWithUsers>;

    updateChat: (
        chatId: number,
        data: IUpdateChat,
        filename: string | null
    ) => Promise<IChatWithUsers>;

    deleteChat: (
        chatId: number
    ) => Promise<void>;

    leaveChat: (
        userId: number,
        chatId: number
    ) => Promise<void>;

    findChatById: (
        chatId: number
    ) => Promise<IChatWithUsers | null>;
    getChatByParticipants: (
        userId: number,
        participantId: number,
    ) => Promise<IChatWithUsers | null>;
    getChatParticipants: (
        chatId: number
    ) => Promise<ChatParticipants | null>
}




export interface ChatClientEvents {
	joinChat: (data: JoinChatPayload, ack?: JoinChatCallback) => void;
	leaveChat: (data: LeaveChatPayload) => void;
}

export interface ChatSocketControllerContract {
    registerHandlers: (socket: AuthenticatedSocket) => void
    joinChat: (
        socket: AuthenticatedSocket,
        data: JoinChatPayload,
        ack?: JoinChatCallback,
    ) => void;
    leaveChat: (socket: AuthenticatedSocket, data: LeaveChatPayload) => void;
}