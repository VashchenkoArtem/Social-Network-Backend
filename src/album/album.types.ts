import { Prisma } from "@prisma/client";
import { Request, Response } from "express";


export type AlbumWithRelations = Prisma.AlbumGetPayload<{
    include: {
        topic: true;
        createdAt: true;
    };
}>;

export type ErrorResponse = {
    message: string;
};

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email?: string;
    };
}

export interface IAlbumServiceContract {
    getAll: (userId: number) => Promise<AlbumWithRelations[]>;
    create: (data: CreateAlbumRequest, userId: number) => Promise<AlbumWithRelations>;
    update: (albumId: number, data: UpdateAlbumRequest) => Promise<AlbumWithRelations>;
}

export interface IAlbumControllerContract {
    getAlbums: (
        req: AuthenticatedRequest, 
        res: Response<AlbumWithRelations[] | ErrorResponse>
    ) => Promise<void>;

    createAlbum: (
        req: AuthenticatedRequest, 
        res: Response<AlbumWithRelations | ErrorResponse>
    ) => Promise<void>;

    updateAlbum: (
        req: AuthenticatedRequest, 
        res: Response<AlbumWithRelations | ErrorResponse>
    ) => Promise<void>;
}

export interface CreateAlbumRequest {
    title: string;
    theme: string;
    year: string;
    isVisible: boolean;
}

export type UpdateAlbumRequest = Partial<CreateAlbumRequest>;