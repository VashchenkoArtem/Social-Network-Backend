import { client } from "../client/client";
import { IAlbumRepositoryContract, CreatePhotoInput, CreateAlbumInput } from "./album.types";

export const AlbumRepository: IAlbumRepositoryContract = {
    createAlbum: async (data) => {
        try {
            const album = await client.album.create({
                data,
                include: {
                    photos: true,
                },
            })
            return album
        } catch (error) {
            throw new Error("Не вдаллся створити альбом. Спробуйте ще раз.")
        }
    },

    addPhoto: async (data) => {
        try {
            const photo = await client.photo.create({
                data: {
                    filename: data.image,
                    file: data.image,
                    album: {
                        connect: { id: data.albumId },
                    }
                }
            })
            return photo
        } catch (error) {
            throw new Error("Не вдаллся додати фото до альбому. Спробуйте ще раз.")
        }
    },

    findAlbumById: async (id: number) => {
        try {
            const album = await client.album.findUnique({
                where: { id },
                include: {
                    photos: true,
                },
            })
            return album
        } catch (error) {
            throw new Error("Альбом не знайдено")
        }
    },

    albumVisibility: async (id: number, isVisible: boolean) => {
        try {
            const album = await client.album.update({
                where: { id },
                data: {
                    isVisible,
                },
                include: {
                    photos: true,
                },
            })
            return album
        } catch (error) {
            throw new Error("Не вдаллся оновити видимість альбому")
        }
    },

    getUserAlbums: async (userId: number) => {
        try {
            return await client.album.findMany({
                where: {
                    authorId: userId,
                },
                include: {
                    photos: true,
                },
            })
        } catch (error) {
            throw new Error("Не вдалося отримати альбоми")
        }
    },
}