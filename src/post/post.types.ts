import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export type Post = Prisma.PostGetPayload<{
    include: {
        photos: true
        tags: true
        author: true
        urls: true
   }
}>

export type CreatePost = Prisma.PostUncheckedCreateInput
export type UpdatePost = Prisma.PostUncheckedUpdateInput


export interface IPostControllerContract {
    getAllPosts: (
        req: Request<object, Post[] | string, object, {take?: string}>,
        res: Response<Post[] | string>
    ) => void
    
    createPost: (
        req: Request<object, Post | string, CreatePost, object>,
        res: Response<Post | string>
    ) => void
    
    getMyPosts: (
        req: Request<object, Post[] | string, object >,
        res: Response<Post[] | string>
   ) => void
}

export interface IPostServiceContract {
    getAllPosts: (take?: number) => Promise<Post[] | string>

    createPost: (data: CreatePost) => Promise<Post | string>
    
    getMyPosts: (userId: number) => Promise<Post[]>
}

export interface IPostRepositoryContract {
    getAllPosts: (take?: number) => Promise<Post[] | string>

    createPost: (data: CreatePost) => Promise<Post | string>
    
    getMyPosts: (userId: number) => Promise<Post[]>

}