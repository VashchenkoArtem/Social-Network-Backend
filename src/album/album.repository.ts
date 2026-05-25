import { client } from "../client/client";
import { Prisma } from "@prisma/client";
import { NotFoundError, AppError } from "../errors";
import { IAlbumRepositoryContract } from "./types/album.contracts";

export const AlbumRepository: IAlbumRepositoryContract = {

    addPhoto: async (data, albumId) => {
        try {
            const photo = await client.profile_app_albumimage.create({
                data: {
                    image: data.image,
                    is_shown: true,
                    created_at: new Date(Date.now()),
                    profile_app_album: {
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

    findAlbumById: async (id) => {
        try {
            const album = await client.profile_app_album.findUnique({
                where: { id },
                include: {
                    profile_app_albumimage: true,
                },
            })
            return album
        } catch (error) {
            throw new Error("Альбом не знайдено")
        }
    },

    albumVisibility: async (id, is_shown) => {
        try {
            const album = await client.profile_app_album.update({
                where: { id },
                data: {
                    is_shown,
                },
                include: {
                    profile_app_albumimage: true,
                },
            })
            return album
        } catch (error) {
            throw new Error("Не вдаллся оновити видимість альбому")
        }
    },

    getUserAlbums: async (userId) => {
        try {
            return await client.profile_app_album.findMany({
                where: {
                    profile_app_profile: {
                        user_app_user: {
                            id: userId
                        }
                    }
                },
                orderBy: {
                    created_at: "desc"
                },
                include: {
                    profile_app_albumimage: true
                },
            })
        } catch (error) {
            console.log(error)
            throw new Error("Не вдалося отримати альбоми")
        }
    },
    createAlbum: async (data, userId) => {
        try {
            const album = await client.profile_app_album.create({
                data: {
                    name: data.name,
                    is_shown: data.is_shown ?? true,
                    profile_app_profile: { connect: { id: userId } },
                    theme: data.theme ?? null,
                    is_default: false,
                    year: Number(data.year),
                    created_at: new Date(Date.now())
                },
                include: {
                    profile_app_albumimage: true,
                }
            });
            return album
        } catch (error) {
            console.log(error)
            throw new AppError("Could not create album", 500);
        }
    },
    updateAlbum: async (albumId, data) => {
        try {
            const updateData = { ...data };

            if (data.year !== undefined) {
                updateData.year = Number(data.year);
            }

            return await client.profile_app_album.update({
                where: { id: Number(albumId) },
                data: updateData,
                include: {
                    profile_app_albumimage: true
                }
            });
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError("Album");
            }
            console.error("Prisma Error:", error);
            throw new AppError("Could not update album", 500);
        }
    },
    deleteAlbum: async (albumId) => {
        try {
            const deletedAlbum = await client.profile_app_album.delete({
                where: { id: albumId },
                include: {
                    profile_app_albumimage: true,
                    profile_app_profile: true
                }
            })
            return deletedAlbum
        } catch (error) {
            console.log(error)
            throw new AppError("Could not delete album", 500);
        }
    },
    findPhotoById: async (photoId: number) => {
        return await client.profile_app_albumimage.findUnique({
            where: { id: photoId }
        });
    },

    deletePhoto: async (photoId: number) => {
        try {
            await client.profile_app_albumimage.delete({
                where: { id: photoId }
            });
        } catch (error) {
            console.log(error)
            throw new AppError("Не вдалося видалити фото з бази даних", 500);
        }
    },

    togglePhotoVisibility: async (photoId: number, is_shown: boolean) => {
        try {
            return await client.profile_app_albumimage.update({
                where: { id: photoId },
                data: { is_shown },
            });
        } catch (error) {
            throw new AppError("Не вдалося змінити видимість фото", 500)
        }
    },
}

