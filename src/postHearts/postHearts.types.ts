import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export type Heart = Prisma.post_app_postheartGetPayload<{}>

export interface IPostHeartsControllerContract {
    getPostHearts: (
        req: Request<{ postId: string }, number | string>,
        res: Response<number | string>
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
    getPostHearts: (postId: number) => Promise<number | string>
    createHeart: (postId: number, userId: number) => Promise<Heart | string>
    deleteHeart: (postId: number, userId: number) => Promise<Heart | string>
}

export interface IPostHeartsRepositoryContract {
    getPostHearts: (postId: number) => Promise<number>
    createHeart: (postId: number, userId: number) => Promise<Heart>
    deleteHeart: (postId: number, userId: number) => Promise<Heart>
}