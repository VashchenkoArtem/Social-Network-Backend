import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export type Album = Prisma.AlbumGetPayload<{
    include: { photos: true }
}>

export type CreateAlbumInput = Prisma.AlbumUncheckedCreateInput
export type UpdateAlbumInput = Prisma.AlbumUpdateInput

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
    ) => Promise<void>,
    createAlbum: (
        req: Request<object, Album | ErrorResponse, CreateAlbumInput>,
        res: Response<Album | ErrorResponse>
    ) => Promise<void>;

    updateAlbum: (
        req: AuthenticatedRequest, 
        res: Response<Album | ErrorResponse>
    ) => Promise<void>;
    deleteAlbum: (
        req: Request<{albumId: string}, Album | string, object>,
        res: Response<Album | string>
    ) => Promise<void>
}

export interface IAlbumServiceContract {
    uploadPhoto: (file: Express.Multer.File, albumId: number, userId: number) => Promise<Photo>
    albumVisibility: (albumId: number, userId: number) => Promise<Album | string>
    getUserAlbums: (userId: number) => Promise<Album[]>
    createAlbum: (data: CreateAlbumInput, userId: number) => Promise<Album | string>;
    updateAlbum: (albumId: number, data: UpdateAlbumInput) => Promise<Album>;
    deleteAlbum: (albumId: number) => Promise<Album | string>
}

export interface IAlbumRepositoryContract {
    createAlbum: (data: CreateAlbumInput, userId: number) => Promise<Album | string>
    addPhoto: (data: PhotoWithoutAlbumId, albumId: number) => Promise<Photo>
    findAlbumById: (id: number) => Promise<Album | null>
    albumVisibility: (id: number, isVisible: boolean) => Promise<Album | string>
    getUserAlbums: (userId: number) => Promise<Album[]>
    updateAlbum: (albumId: number, data: UpdateAlbumInput) => Promise<Album | string>
    deleteAlbum: (albumId: number) => Promise<Album | string>
}

export type ErrorResponse = {
    message: string;
};

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email?: string;
    };
}