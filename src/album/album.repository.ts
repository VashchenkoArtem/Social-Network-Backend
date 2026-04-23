import { client } from "../client/client";
import { IAlbumRepositoryContract } from "./album.types";
import { Prisma } from "@prisma/client";
import { NotFoundError, AppError } from "../errors";

export const AlbumRepository: IAlbumRepositoryContract = {

    addPhoto: async (data, albumId) => {
        try {
            const photo = await client.photo.create({
                data: {
                    filename: data.filename,
                    album: {
                        connect: { id: albumId },
                    }
                }
            })
            return photo
        } catch (error) {
            console.log(error)
            throw new Error("Не вдалoся додати фото до альбому. Спробуйте ще раз.")
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
                    year: true,
                    topic: true
                },
            })
        } catch (error) {
            console.log(error)
            throw new Error("Не вдалося отримати альбоми")
        }
    },
    createAlbum: async (data, userId) => {
        const tag = await client.tag.findFirst({
            where: { id: data.topicId }
        });
        const year = await client.albumYear.findFirst({
            where: { id: data.yearId }
        });
        console.log(data)
        if (!year) throw new NotFoundError("Year");
        if (!tag) throw new NotFoundError(`Theme`);
        console.log(data.yearId)
        try {
            const album = await client.album.create({
                data: {
                    title: data.title,
                    isVisible: data.isVisible ?? true,
                    author: { connect: { id: userId } },
                    topic: { connect: { id: tag.id } },
                    year: { connect: {id: year.id}}
                },
                include: {
                    photos: true,
                    topic: true,
                    year: true
                }
            });
            if (!data.topicId || !data.yearId) {
                throw new NotFoundError('Topic or Year not found');
            }
            return album
        } catch (error) {
            throw new AppError("Could not create album", 500);
        }
    },
    updateAlbum: async (albumId, data) => {
        try {
            return await client.album.update({
                where: { id: albumId },
                data: data,
                include: {
                    photos: true
                }
            });
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError("Album");
            }
            console.log(error)
            throw new AppError("Could not update album", 500);
        }
    },
    deleteAlbum: async (albumId) => {
        try {
            const deletedAlbum = await client.album.delete({
                where: { id: albumId },
                include: {
                    photos: true,
                    topic: true,
                    year: true,
                    author: true
                }
            })
            return deletedAlbum
        } catch (error) {
            console.log(error)
            throw new AppError("Could not delete album", 500);
        }
    },
    findPhotoById: async (photoId: number) => {
        return await client.photo.findUnique({
            where: { id: photoId }
        });
    },

    deletePhoto: async (photoId: number) => {
        try {
            await client.photo.delete({
                where: { id: photoId }
            });
        } catch (error) {
            throw new AppError("Не вдалося видалити фото з бази даних", 500);
        }
    },

    togglePhotoVisibility: async (photoId: number, isVisible: boolean) => {
        try {
            return await client.photo.update({
                where: { id: photoId },
                data: { isVisible },
            });
        } catch (error) {
            throw new AppError("Не вдалося змінити видимість фото", 500)
        }
    },
}

