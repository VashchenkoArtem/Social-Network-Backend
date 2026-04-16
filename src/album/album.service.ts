import { client } from "../client/client";
import { Multer } from "multer";
import { IAlbumServiceContract } from "./album.types";

export const AlbumService: IAlbumServiceContract = {
    uploadPhoto: async (file, userId) => {
        const album = await client.album.create({
            data: {
                authorId: userId,
                isVisible: true,
                topicId: 1,
                dateId: 1
            }, include: {
                photos: true
            },
        })
        if (!file) {
            throw new Error("файл є обов'язковим")
        }

        const photo = await client.photo.create({
            data: {
                filename: file.filename,
                file: `/uploads/${file.filename}`,
                albumId: album.id
            }
        })

        return { album, photo }
    },

    albumVisibility: async (albumId, userId) => {
        const album = await client.album.findFirst({
            where: {
                id: albumId,
                authorId: userId
            }
        })

        if (!album) {
            throw new Error("Альбом не знайдено")
        }

        const updatedAlbum = await client.album.update({
            where: { id: albumId },
            data: {
                isVisible: !album.isVisible,
            },
            include: {
                photos: true
            }
        })

        return updatedAlbum
    },

    getUserAlbums: async (userId) => {
        const albums = await client.album.findMany({
            where: {
                authorId: userId,
            },
            include: {
                photos: true,
            },
        })
        return albums
    }
}