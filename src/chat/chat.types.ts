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

export interface IChatControllerContract {
    getGroupChats: (
        req: Request<object, IChatWithUsers[] | string, object>,
        res: Response<IChatWithUsers[] | string>
    ) => void


    getPersonalChats: (
        req: Request<object, IChatWithUsers[] | string, object>,
        res: Response<IChatWithUsers[] | string>
    ) => void
}   
export interface IChatServiceContract {
    getGroupChats: (userId: number)=> Promise<IChatWithUsers[]>
    getPersonalChats: (userId: number) => Promise<IChatWithUsers[]>
}

export interface IChatRepositoryContract {
    getGroupChats: (userId: number) => Promise<IChatWithUsers[]>,
    getPersonalChats: (userId: number) => Promise<IChatWithUsers[]>
}


