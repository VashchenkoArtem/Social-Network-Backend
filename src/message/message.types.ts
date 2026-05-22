import { Prisma } from "@prisma/client"
import type { Request, Response } from "express"

export type IMessage = Prisma.chat_app_messageGetPayload<{}>

export interface IMessageControllerContract {
    getMessages: (
        req: Request<{chatId: string}, IMessage[] | string, object>,
        res: Response<IMessage[] | string>
    ) => void
}


export interface IMessageServiceContract {
    getMessages: (chatId: number) => Promise<IMessage[]>
}

export interface IMessageRepositoryContract {
    getMessages: (chatId: number) => Promise<IMessage[]>
}


