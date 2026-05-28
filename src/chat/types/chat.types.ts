import { Prisma } from "@prisma/client";


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
export type IChat = Prisma.chat_app_chatGetPayload<{}>
export type IChatParticipant = Prisma.chat_app_chatGetPayload<{
    include: {
        chat_app_chat_users: true
    }
}>;

export interface ICreateGroupChatDto {
    name: string;
    userIds: number[];
    isGroup?: boolean

}

export type IUpdateChat = {
    name?: string;
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