import { Prisma } from "@prisma/client";

export type IChatWithUsers = Prisma.chat_app_chatGetPayload<{
    include: {
        chat_app_chat_users: {
            select: {
                user_app_user: {
                    select: {
                        id: true,
                        username: true
                        profile_app_profile: {
                            select: {
                                id: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        }
    }
}>

export type IChat = Prisma.chat_app_chatGetPayload<{}>
export type IChatParticipant = Prisma.chat_app_chatGetPayload<{
    include: {
        chat_app_chat_users: true
    }
}>;

export interface IChatWithPaginationResponse {
    chats: IChatWithUsers[]
    meta: {
        nextCursor: number | null;
        hasMore: boolean;
    };
}
export interface IChatQuery {
    limit?: string;
    cursor?: string;
}

export interface PaginationDTO {
    limit?: number;
    cursor?: number;
}
export interface ICreateGroupChatDto {
    name: string;
    userIds: number[];
    is_group?: string

}

export type IUpdateChat = {
    name: string;
    userIds: number[];
};
export interface JoinChatPayload {
    chatId: number
}

export interface LeaveChatPayload {
    chatId: number
}

export type JoinChatCallback = (
    response: { status: "ok" } | { status: "error"; message?: string}
) => void

export type CreateChat = Prisma.chat_app_chatUncheckedCreateInput

export type ChatParticipants = Prisma.chat_app_chatGetPayload<{
    select: {
       chat_app_chat_users: {
           select: {
            id: true,
            user_app_user: true
        }
       }
    }
}>