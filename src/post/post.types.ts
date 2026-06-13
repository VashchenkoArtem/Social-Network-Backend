import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";


export type Post = Prisma.post_app_postGetPayload<{
    include: {
        post_app_postimage: true,
        post_app_post_tags: true,
        user_app_user: true,
        post_app_postlink: true,
    }
}>
export interface PaginationDTO {
    limit?: number;
    cursor?: number;
}
export interface PaginatedPostsResponse {
    data: Post[];
    meta: {
        nextCursor: number | null;
        hasMore: boolean;
    };
}
export type CreatePostDTO = {
    title: string;
    content: string;
    topic: string;
    tags: number[];
    urls: string[];
    author_id: number
}
export interface GetPostsQuery {
    limit?: string;
    cursor?: string;
}
export type CreatePost = Prisma.post_app_postUncheckedCreateInput
export type UpdatePost = Prisma.post_app_postUncheckedUpdateInput

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
        req: Request<
            object,
            PaginatedPostsResponse | string,
            object,
            GetPostsQuery
        >,
        res: Response<PaginatedPostsResponse | string>
    ) => void;
    
    createPost: (
        req: Request<object, Post | string, CreatePostDTO, object>,
        res: Response<Post | string>
    ) => void
    
    getMyPosts: (
        req: Request<object, PaginatedPostsResponse | string, object, GetPostsQuery >,
        res: Response<PaginatedPostsResponse | string>
   ) => void

//     deletePost: (
//         req: Request<{id: string}, Post | string, object>,
//         res: Response<Post | string>
//    ) => void

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
    viewPost: (
        req: Request<{ id: string }, { message: string } | string, { userId: string }>,
        res: Response<{ message: string } | string>
    ) => void | Promise<void>
}

export interface IPostServiceContract {
    getAllPosts: (paginationData: PaginationDTO) => Promise<PaginatedPostsResponse>;

    createPost: (data: CreatePostDTO, files?: Express.Multer.File[]) => Promise<Post | string>
    
    // getMyPosts: (userId: bigint) => Promise<Post[]>
    getMyPosts: (userId: bigint, paginationData: PaginationDTO) => Promise<PaginatedPostsResponse>

    // deletePost: (postId: number) => Promise<Post | string>
    updatePost: (postId: bigint, data: UpdatePostDto, files?: Express.Multer.File[]) => Promise<Post | string>

    deletePost: (postId: bigint) => Promise<{ message: string } | string>
    getPostsByUserId: (userId: bigint) => Promise<Post[]>

    viewPost: (postId: bigint, userId: bigint) => Promise<{ message: string }>
}

export interface IPostRepositoryContract {
    getAllPosts: (
        paginationData: PaginationDTO
    ) => Promise<PaginatedPostsResponse>;

    createPost: (data: CreatePostDTO, files?: Express.Multer.File[]) => Promise<Post | string>
    
    getMyPosts: (userId: bigint, paginationData: PaginationDTO) => Promise<PaginatedPostsResponse>

    updatePost: (postId: bigint, data: UpdatePostDto, files?: Express.Multer.File[]) => Promise<Post | string>

    deletePost: (postId: bigint) => Promise<{ message: string } | string>
    getPostsByUserId: (userId: bigint) => Promise<Post[]>

    viewPost: (postId: bigint, userId: bigint) => Promise<{ message: string }>
}