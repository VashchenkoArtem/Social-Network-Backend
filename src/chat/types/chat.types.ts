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

export type IChatParticipant = Prisma.chat_app_chatGetPayload<{
    include: {
        chat_app_chat_users: true
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
};

export type IUpdateChat = {
    name?: string;
};

