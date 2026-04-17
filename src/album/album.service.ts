import { IAlbumServiceContract } from "./album.types";
import { AlbumRepository } from "./album.repository";
import { ValidationError, AppError, BadRequestError } from "../errors";

export const AlbumService: IAlbumServiceContract = {
    getAll: async (userId: number) => {
        try {
            return await AlbumRepository.findAll(userId);
        } catch (error: unknown) {
            if (error instanceof AppError) throw error;
            throw new AppError("Failed to fetch albums", 500);
        }
    },
    
    create: async (data, userId) => {
        return await AlbumRepository.create(data, userId);
    },

    update: async (albumId, data) => {
        try {
            if (!data || Object.keys(data).length === 0) {
                throw new BadRequestError("No data provided for update");
            }
            return await AlbumRepository.update(albumId, data);
        } catch (error: unknown) {
            if (error instanceof AppError) throw error;
            throw new AppError("Failed to update album", 500);
        }
    }
};