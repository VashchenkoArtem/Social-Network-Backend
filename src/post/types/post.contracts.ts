import { Request, Response } from "express";
import { Post, CreatePost, UpdatePostDto, PostParams } from "./post.types";

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
        req: Request<object, Post[] | string, object>,
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

    getPostsByUserId: (
        req: Request<{userId: string}, Post[] | string, object>,
        res: Response<Post[] | string>
    ) => void
}

export interface IPostServiceContract {
    getAllPosts: (take?: number) => Promise<Post[] | string>
    createPost: (data: CreatePost, files?: Express.Multer.File[]) => Promise<Post | string>
    getMyPosts: (userId: bigint) => Promise<Post[]>
    updatePost: (postId: bigint, data: UpdatePostDto, files?: Express.Multer.File[]) => Promise<Post | string>
    deletePost: (postId: bigint) => Promise<{ message: string } | string>
    getPostsByUserId: (userId: bigint) => Promise<Post[]>
}

export interface IPostRepositoryContract {
    getAllPosts: (take?: number) => Promise<Post[] | string>
    createPost: (data: CreatePost, files?: Express.Multer.File[]) => Promise<Post | string>
    getMyPosts: (userId: bigint) => Promise<Post[]>
    updatePost: (postId: bigint, data: UpdatePostDto, files?: Express.Multer.File[]) => Promise<Post | string>
    deletePost: (postId: bigint) => Promise<{ message: string } | string>
    getPostsByUserId: (userId: bigint) => Promise<Post[]>
}