import { Prisma } from "@prisma/client"
import { PageNumberCounters, PageNumberPagination } from "prisma-extension-pagination/dist/types"

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
    chat_id: number
}

export interface IMessageWithPagination {
    messages: IMessage[]
    pagination: PageNumberPagination & PageNumberCounters
}