import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";


export type Post = Prisma.PostGetPayload<{
    include: {
        photos: true,
        tags: true,
        author: true,
        urls: true,
    }
}>

export type CreatePost = Prisma.PostUncheckedCreateInput
export type UpdatePost = Prisma.PostUncheckedUpdateInput

export interface UpdatePostDto {
    title?: string;
    topic?: string;
    content?: string;
    tags?: number[] | string[] | string | number;
    urls?: string[] | string;
    authorId?: number | string;
    existingPhotos?: string[] | string;
}

export interface PostParams extends ParamsDictionary {
    id?: string; 
}


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

    updatePost: (
        req: Request<PostParams, Post | string, UpdatePostDto>,
        res: Response<Post | string>
    ) => void | Promise<void>;

    deletePost: (
        req: Request<PostParams, { message: string } | string>,
        res: Response<{ message: string } | string>
    ) => void | Promise<void>;
}

export interface IPostServiceContract {
    getAllPosts: (take?: number) => Promise<Post[] | string>

    createPost: (data: CreatePost, files?: Express.Multer.File[]) => Promise<Post | string>
    
    getMyPosts: (userId: number) => Promise<Post[]>

    updatePost: (postId: number, data: UpdatePostDto, files?: Express.Multer.File[]) => Promise<Post | string>

    deletePost: (postId: number) => Promise<{ message: string } | string>
}

export interface IPostRepositoryContract {
    getAllPosts: (take?: number) => Promise<Post[] | string>

    createPost: (data: CreatePost, files?: Express.Multer.File[]) => Promise<Post | string>
    
    getMyPosts: (userId: number) => Promise<Post[]>

    updatePost: (postId: number, data: UpdatePostDto, files?: Express.Multer.File[]) => Promise<Post | string>

    deletePost: (postId: number) => Promise<{ message: string } | string>

}