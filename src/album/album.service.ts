import { client } from "../client/client";
import { Multer } from "multer";
import { IAlbumServiceContract } from "./album.types";
import { AlbumRepository } from "./album.repository";
import { ValidationError, AppError, BadRequestError, NotFoundError } from "../errors";
import fs from "fs";
import path, { join } from "path";
import { thumbDir, originalDir } from "../config/path";


export const AlbumService: IAlbumServiceContract = {
    uploadPhoto: async (file, albumId) => {
        if (!file) {
            throw new Error("файл є обов'язковим")
        }
        const imagePhoto = {
            filename: file.filename,
            file: file.path
        }
        const photo = await AlbumRepository.addPhoto(imagePhoto, albumId)
        if (typeof photo === "string"){
            throw new Error("Помилка. Не вдалось додати зображення")
        }
        return photo
    },

    albumVisibility: async (albumId, userId) => {
        const visibleAlbum = await AlbumRepository.albumVisibility(albumId, true)
        // const updatedAlbum = await client.album.update({
        //     where: { id: albumId },
        //     data: {
        //         isVisible: !album.isVisible,
        //     },
        //     include: {
        //         photos: true
        //     }
        // })

        return visibleAlbum
    },

    getUserAlbums: async (userId) => {
        const albums = await AlbumRepository.getUserAlbums(userId)
        return albums
    },
    createAlbum: async (data, userId) => {
        const album =  await AlbumRepository.createAlbum(data, userId);
        if (typeof album === "string"){
            throw new BadRequestError("Request error");
        }
        return album
    },

    updateAlbum: async (albumId, data) => {
        const album = await AlbumRepository.updateAlbum(albumId, data);
        if (typeof album === "string"){
            throw new BadRequestError("Request error")
        }
        return album
    },
    deleteAlbum: async (albumId: number) => {
        const deletedAlbum = await AlbumRepository.deleteAlbum(albumId);

        if (typeof deletedAlbum === "string") {
            throw new BadRequestError("Помилка при видаленні альбому");
        }
        if (deletedAlbum.photos && deletedAlbum.photos.length > 0) {
            deletedAlbum.photos.forEach(photo => {
                try {
                    const thumbPath = join(thumbDir, photo.filename);
                    const originalPath = join(originalDir, photo.filename);

                    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
                    if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
                } catch (err) {
                    console.error(`Не вдалося видалити файл ${photo.filename}:`, err);
                }
            });
        }

        return deletedAlbum;
    },
    deletePhoto: async (photoId: number) => {
        const photo = await AlbumRepository.findPhotoById(photoId);
        
        if (!photo) {
            throw new NotFoundError("Фото не знайдено");
        }
        await AlbumRepository.deletePhoto(photoId);
        try {
            const thumbPath = join(thumbDir, photo.filename);
            const originalPath = join(originalDir, photo.filename);

            if (fs.existsSync(thumbPath)) {
                fs.unlinkSync(thumbPath);
            }
            if (fs.existsSync(originalPath)) {
                fs.unlinkSync(originalPath);
            }
        } catch (error) {
            console.error("Помилка при видаленні файлів з диска:", error);
        }

        return { message: "Фото успішно видалено" };
    }
};
