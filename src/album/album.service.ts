import { client } from "../client/client";
import { Multer } from "multer";
import { IAlbumServiceContract } from "./album.types";
import { AlbumRepository } from "./album.repository";
import { ValidationError, AppError, BadRequestError } from "../errors";


export const AlbumService: IAlbumServiceContract = {
    uploadPhoto: async (file, albumId, userId) => {
        if (!file) {
            throw new Error("файл є обов'язковим")
        }
        const imagePhoto = {
            filename: file.filename,
            userId: userId,
            avatarForId: null
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
    deleteAlbum: async (albumId) => {
        const deletedAlbum = await AlbumRepository.deleteAlbum(albumId);
        return deletedAlbum
    }
};
