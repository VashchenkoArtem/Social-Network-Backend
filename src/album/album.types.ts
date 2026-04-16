import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export type Album = Prisma.AlbumGetPayload<{
    include: { photos: true }
}>

export type CreateAlbumInput = {
    isVisible: boolean
    authorId: number
    topicId: number
    dateId: number
}

export type Photo = Prisma.PhotoGetPayload<{}>

export type CreatePhotoInput = {
    image: string,
    albumId: number
}

export type AlbumVisibilityInput = {
    albumId: number
}

export type UploadPhotoResponse = {
    album: Album
    photo: Photo
}


export interface IAlbumControllerContract {
    uploadPhoto: (
        req: Request<object, UploadPhotoResponse | string, object>,
        res: Response<UploadPhotoResponse | string>
    ) => Promise<void>

    albumVisibility: (
        req: Request<{ id: string }, Album | string, AlbumVisibilityInput>,
        res: Response<Album | string>
    ) => Promise<void>

    getUserAlbums: (
        req: Request,
        res: Response<Album[] | string>
    ) => Promise<void>
}

export interface IAlbumServiceContract {
    uploadPhoto: (file: Express.Multer.File, userId: number) => Promise<UploadPhotoResponse>
    albumVisibility: (albumId: number, userId: number) => Promise<Album | string>
    getUserAlbums: (userId: number) => Promise<Album[]>
}

export interface IAlbumRepositoryContract {
    createAlbum: (data: CreateAlbumInput) => Promise<Album | string>
    addPhoto: (data: CreatePhotoInput) => Promise<Photo | string>
    findAlbumById: (id: number) => Promise<Album | null>
    albumVisibility: (id: number, isVisible: boolean) => Promise<Album | string>
    getUserAlbums: (userId: number) => Promise<Album[]>
}