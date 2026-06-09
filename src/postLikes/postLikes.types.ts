import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export type Like = Prisma.post_app_postlikeGetPayload<{}>

export interface IPostLikesControllerContract {
    getAllLikes: (
        req: Request<object, Like[] | string>,
        res: Response<Like[] | string>
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
    getAllLikes: () => Promise<Like[] | string>
    createLike: (postId: number, userId: number) => Promise<Like | string>
    deleteLike: (postId: number, userId: number) => Promise<Like | string>
}

export interface IPostLikesRepositoryContract {
    getAllLikes: () => Promise<Like[]>
    createLike: (postId: number, userId: number) => Promise<Like>
    deleteLike: (postId: number, userId: number) => Promise<Like>
}