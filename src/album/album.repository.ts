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
                    createdAt: true,
                    topic: true
                },
            })
        } catch (error) {
            throw new Error("Не вдалося отримати альбоми")
        }
    },
    createAlbum: async (data, userId) => {
        const tag = await client.tag.findFirst({
            where: { id: data.topicId }
        });

        if (!tag) throw new NotFoundError(`Theme`);

        const album = await client.album.create({
            data: {
                title: data.title,
                isVisible: data.isVisible ?? true,
                author: { connect: { id: userId } },
                topic: { connect: { id: tag.id } },
                createdAt: { connect: {id: data.dateId}}
            },
            include: {
                photos: true,
                topic: true,
                createdAt: true
            }
        });
        return album
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
            throw new AppError("Could not update album", 500);
        }
    }
}

