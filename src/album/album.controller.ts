import { Response } from "express";
import { 
    IAlbumControllerContract, 
    AuthenticatedRequest, 
    AlbumWithRelations, 
    ErrorResponse 
} from "./album.types";
import { AlbumService } from "./album.service";
import { AppError, AuthenticationError } from "../errors";

export const albumController: IAlbumControllerContract = {
    getAlbums: async (req: AuthenticatedRequest, res: Response<AlbumWithRelations[] | ErrorResponse>) => {
        try {
            const userId = 1; //req.user?.id
            if (!userId) {
                throw new AuthenticationError("Користувач не авторизований");
            }

            const albums = await AlbumService.getAll(userId);
            res.status(200).json(albums);
        } catch (error: unknown) {
            handleError(error, res);
        }
    },

    createAlbum: async (req: AuthenticatedRequest, res: Response<AlbumWithRelations | ErrorResponse>) => {
        try {
            const userId = 1; //
            if (!userId) {
                throw new AuthenticationError("Користувач не авторизований");
            }

            const album = await AlbumService.create(req.body, userId);
            res.status(201).json(album);
        } catch (error: unknown) {
            handleError(error, res);
        }
    },

    updateAlbum: async (req: AuthenticatedRequest, res: Response<AlbumWithRelations | ErrorResponse>) => {
        try {
            const id = parseInt(String(req.params.id), 10);

            if (isNaN(id)) {
                throw new AppError("ID альбому має бути числом", 400);
            }
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new AppError("Відсутні дані для оновлення", 400);
            }
            const album = await AlbumService.update(id, req.body);
            res.status(200).json(album);
        } catch (error: unknown) {
            handleError(error, res);
        }
    }
};

function handleError(error: unknown, res: Response<ErrorResponse>) {
    const statusCode = error instanceof AppError ? error.code : 500;
    const message = error instanceof Error ? error.message : "Внутрішня помилка сервера";
    
    res.status(statusCode).json({ message });
}