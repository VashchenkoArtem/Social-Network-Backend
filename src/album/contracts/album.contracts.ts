import { Request, Response } from "express";
import { Album, AlbumVisibilityInput, AuthenticatedRequest, CreateAlbumInput, ErrorResponse, Photo, PhotoWithoutAlbumId, UpdateAlbumInput } from "./album.types";

export interface IAlbumControllerContract {
    uploadPhoto: (
        req: Request< 
            {albumId: string}, 
            Photo[] | string, 
            object
        >,
        res: Response<
            Photo[] | string
        >
    ) => Promise<void>

    albumVisibility: (
        req: Request<
            { id: string }, 
            Album | string, 
            AlbumVisibilityInput
        >,
        res: Response<
            Album | string
        >
    ) => Promise<void>

    getUserAlbums: (
        req: Request<
            { userId: string }, 
            Album[] | string
        >,
        res: Response<
            Album[] | string
        >
    ) => Promise<void>,

    createAlbum: (
        req: Request<
            object, 
            Album | ErrorResponse, 
            CreateAlbumInput
        >,
        res: Response<
            Album | ErrorResponse
        >
    ) => Promise<void>;

    updateAlbum: (
        req: Request<
            {id: string}, 
            Album | string, 
            object
        >, 
        res: Response<
            Album | ErrorResponse
        >
    ) => Promise<void>;
    deleteAlbum: (
        req: Request<
            { id: string }, 
            Album | string, 
            object
            >,
        res: Response<
            Album | string
        >
    ) => Promise<void>;

    deletePhoto: (
        req: Request<
            { photoId: string }, 
            { message: string } | string
        >,
        res: Response<
            { message: string } | string
        >
    ) => Promise<void>;

    togglePhotoVisibility: (
        req: Request<
            { photoId: string }, 
            Photo | string, 
            object
        >,
        res: Response<
            Photo | string
        >
    ) => Promise<void>;
}

export interface IAlbumServiceContract {
    uploadPhoto: (
        file: Express.Multer.File[], 
        albumId: number, userId: number
    ) => Promise<Photo[]>

    albumVisibility: (
        albumId: number, 
        userId: number
    ) => Promise<Album | string>

    getUserAlbums: (
        userId: number
    ) => Promise<Album[]>

    createAlbum: (
        data: CreateAlbumInput, 
        userId: number
    ) => Promise<Album | string>;

    updateAlbum: (
        albumId: number, 
        data: UpdateAlbumInput
    ) => Promise<Album>;

    deleteAlbum: (
        albumId: number
    ) => Promise<Album | string>

    deletePhoto: (
        photoId: number
    ) => Promise<{ message: string }>;

    togglePhotoVisibility: (
        photoId: number
    ) => Promise<Photo | string>;
}

export interface IAlbumRepositoryContract {
    createAlbum: (
        data: CreateAlbumInput, 
        userId: number
    ) => Promise<Album | string>

    addPhoto: (
        data: PhotoWithoutAlbumId, 
        albumId: number
    ) => Promise<Photo>

    findAlbumById: (
        id: number
    ) => Promise<Album | null>

    albumVisibility: (
        id: number, 
        isVisible: boolean
    ) => Promise<Album | string>

    getUserAlbums: (
        userId: number
    ) => Promise<Album[]>

    updateAlbum: (
        albumId: number, 
        data: UpdateAlbumInput
    ) => Promise<Album | string>

    deleteAlbum: (
        albumId: number
    ) => Promise<Album | string>

    deletePhoto: (
        photoId: number
    ) => Promise<void>;

    findPhotoById: (
        photoId: number
    ) => Promise<Photo | null>;

    togglePhotoVisibility: (
        photoId: number, 
        isVisible: boolean
    ) => Promise<Photo | string>;
}