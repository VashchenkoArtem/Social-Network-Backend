import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export type Album = Prisma.AlbumGetPayload<{
    include: { photos: true }
}>

export type CreateAlbumInput = Prisma.AlbumUncheckedCreateInput

export type Photo = Prisma.PhotoGetPayload<{}>
export type PhotoWithoutAlbumId = Prisma.PhotoGetPayload<{
    omit: {
        albumId: true,
        id: true
    }
}>
// export type CreatePhotoInput = {
//     image: Photo,
//     albumId: number
// }

export type AlbumVisibilityInput = {
    albumId: number
}



export interface IAlbumControllerContract {
    uploadPhoto: (
        req: Request< {albumId: string}, Photo | string, object>,
        res: Response<Photo | string>
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
    uploadPhoto: (file: Express.Multer.File, albumId: number) => Promise<Photo>
    albumVisibility: (albumId: number, userId: number) => Promise<Album | string>
    getUserAlbums: (userId: number) => Promise<Album[]>
}

export interface IAlbumRepositoryContract {
    createAlbum: (data: CreateAlbumInput) => Promise<Album | string>
    addPhoto: (data: PhotoWithoutAlbumId, albumId: number) => Promise<Photo>
    findAlbumById: (id: number) => Promise<Album | null>
    albumVisibility: (id: number, isVisible: boolean) => Promise<Album | string>
    getUserAlbums: (userId: number) => Promise<Album[]>
}