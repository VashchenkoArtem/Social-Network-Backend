import { Prisma } from "@prisma/client";
import { client } from "../client/client";
import { CreateAlbumRequest, UpdateAlbumRequest, AlbumWithRelations } from "./album.types";
import { NotFoundError, AppError } from "../errors";

const albumInclude = {
    topic: true,
    createdAt: true
};

export const AlbumRepository = {
    findAll: async (userId: number): Promise<AlbumWithRelations[]> => {
        return await client.album.findMany({
            where: { authorId: userId },
            include: albumInclude,
            orderBy: { id: 'desc' }
        });
    },

    create: async (data: CreateAlbumRequest, userId: number): Promise<AlbumWithRelations> => {
        const tag = await client.tag.findFirst({
            where: { name: data.theme }
        });

        if (!tag) throw new NotFoundError(`Theme '${data.theme}'`);

        return await client.album.create({
            data: {
                title: data.title,
                isVisible: data.isVisible,
                author: { connect: { id: userId } },
                topic: { connect: { id: tag.id } },
                createdAt: {
                    create: {
                        createdAt: new Date(`${data.year}-01-01T00:00:00Z`)
                    }
                }
            },
            include: albumInclude
        });
    },

    update: async (albumId: number, data: UpdateAlbumRequest): Promise<AlbumWithRelations> => {
        try {
            const updatePayload: Prisma.AlbumUpdateInput = {};

            if (data.title) {
                updatePayload.title = data.title;
            }

            if (data.isVisible !== undefined) {
                updatePayload.isVisible = data.isVisible;
            }

            if (data.theme) {
                updatePayload.topic = {
                    update: { name: data.theme }
                };
            }

            if (data.year) {
                updatePayload.createdAt = {
                    update: { createdAt: new Date(`${data.year}-01-01T00:00:00Z`) }
                };
            }

            return await client.album.update({
                where: { id: albumId },
                data: updatePayload,
                include: albumInclude
            });
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError("Album");
            }
            throw new AppError("Could not update album", 500);
        }
    }
};