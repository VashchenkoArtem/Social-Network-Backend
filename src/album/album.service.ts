import { client } from "../client/client";
import { Multer } from "multer";
import { IAlbumServiceContract } from "./album.types";
import { AlbumRepository } from "./album.repository";

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
    }
}