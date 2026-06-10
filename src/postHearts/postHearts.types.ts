import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export type Heart = Prisma.post_app_postheartGetPayload<{}>

export interface IPostHeartsControllerContract {
    getAllHearts: (
        req: Request<object, Heart[] | string>,
        res: Response<Heart[] | string>
    ) => Promise<void>

    createHeart: (
        req: Request<{ postId: string }, Heart | string, object>,
        res: Response<Heart | string>
    ) => Promise<void>

    deleteHeart:  (
        req: Request<{ postId: string }, Heart | string, object>,
        res: Response<Heart | string>
    ) => Promise<void>
}

export interface IPostHeartsServiceContract {
    getAllHearts: () => Promise<Heart[] | string>
    createHeart: (postId: number, userId: number) => Promise<Heart | string>
    deleteHeart: (postId: number, userId: number) => Promise<Heart | string>
}

export interface IPostHeartsRepositoryContract {
    getAllHearts: () => Promise<Heart[]>
    createHeart: (postId: number, userId: number) => Promise<Heart>
    deleteHeart: (postId: number, userId: number) => Promise<Heart>
}