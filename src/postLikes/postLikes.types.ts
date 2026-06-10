import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export type Like = Prisma.post_app_postlikeGetPayload<{}>

export interface IPostLikesControllerContract {
    getPostLikesCount: (
        req: Request<{ postId: string }, number | string>,
        res: Response<number | string>
    ) => Promise<void>

    createLike: (
        req: Request<{ postId: string }, Like | string, object>,
        res: Response<Like | string>
    ) => Promise<void>

    deleteLike:  (
        req: Request<{ postId: string }, Like | string, object>,
        res: Response<Like | string>
    ) => Promise<void>
}

export interface IPostLikesServiceContract {
    getPostLikesCount: (postId: number) => Promise<number | string>
    createLike: (postId: number, userId: number) => Promise<Like | string>
    deleteLike: (postId: number, userId: number) => Promise<Like | string>
}

export interface IPostLikesRepositoryContract {
    getPostLikesCount: (postId: number) => Promise<number>
    createLike: (postId: number, userId: number) => Promise<Like>
    deleteLike: (postId: number, userId: number) => Promise<Like>
}