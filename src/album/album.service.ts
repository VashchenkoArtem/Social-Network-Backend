
import { AlbumRepository } from "./album.repository";
import { BadRequestError, NotFoundError } from "../errors";
import fs from "fs";
import { join } from "path";
import { thumbDir, originalDir } from "../config/path";
import { UserRepository } from "../user/user.repository";
import { IAlbumServiceContract } from "./types/album.contracts";


export const AlbumService: IAlbumServiceContract = {
    uploadPhoto: async (files, albumId, userId) => {
        if (!files || files.length === 0) {
            throw new Error("Файли є обов'язковими");
        }

        const album = await AlbumRepository.findAlbumById(albumId);
        if (!album) throw new Error("Альбом не знайдено");

        const photos = await Promise.all(
            files.map(async (file) => {
                const imagePhoto = {
                    image: file.filename,
                    is_shown: true,
                    created_at: new Date(),

                    profile_app_album: {
                        connect: {
                            id: BigInt(albumId)
                        }
                    }
                };

                return await AlbumRepository.addPhoto(imagePhoto, albumId);
            })
        );

        if (album.name === "Аватарки" || album.name === "Мої фото") {
            const lastPhoto = photos[photos.length - 1];
            
            if (lastPhoto) {
                await UserRepository.updateUserAvatar(BigInt(userId), lastPhoto.image);
            }
        }

        return photos;
    },

    albumVisibility: async (albumId, userId) => {
        const album = await AlbumRepository.findAlbumById(albumId)
        if (!album) {
            throw new Error("Альбом не знайдено. Спробуйте ще раз.")
        }
        const updatedAlbum = await AlbumRepository.albumVisibility(albumId, !album.is_shown)
        return updatedAlbum
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
        if (deletedAlbum.profile_app_albumimage && deletedAlbum.profile_app_albumimage.length > 0) {
            deletedAlbum.profile_app_albumimage.forEach(photo => {
                try {
                    const thumbPath = join(thumbDir, photo.image);
                    const originalPath = join(originalDir, photo.image);

                    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
                    if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
                } catch (err) {
                    console.error(`Не вдалося видалити файл ${photo.image}:`, err);
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
            const thumbPath = join(thumbDir, photo.image);
            const originalPath = join(originalDir, photo.image);

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
    },

    togglePhotoVisibility: async (photoId: number) => {
        const photo = await AlbumRepository.findPhotoById(photoId)
        if (!photo) {
            throw new Error("Фото не знайдено")
        }
        return await AlbumRepository.togglePhotoVisibility(photoId,!photo.is_shown)
    },
}
