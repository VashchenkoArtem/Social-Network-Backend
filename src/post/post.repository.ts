import { 
    IPostRepositoryContract, 
    Post, 
    UpdatePostDto, 
    CreatePost 
} from "./post.types";
import { Prisma } from "@prisma/client";
import { client } from "../client/client";

export const postRepository: IPostRepositoryContract = {
    getAllPosts: async (take) => {
        try  {
            const posts = await client.post_app_post.findMany({
                take: take !== undefined ? take : 5,
                orderBy: {
                    created_at: "desc"
                },
                include: {
                    author: {
                        include: {
                            user: true
                        }
                    },
                    urls: true,
                    photos: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            })
            return posts
        } catch (error) {
            throw error
        }
    },
    
    getMyPosts: async (userId) => {
        try {
            return await client.post_app_post.findMany({
                where: {
                    authorId: userId
                },
                orderBy: {
                    created_at: "desc"
                },
                include: {
                    author: {
                        include:{
                            user: true
                        }
                    },
                    urls: true,
                    photos: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            })
        } catch (error) {
            throw error
        }
    },
    
    createPost: async (data, files) => {
        try {
            console.log(data.urls)
            const photos = files?.map(file => ({
                original_image: file.filename
            })) ?? [];

            const tags = data.tags ?? [];

            const tagIds = Array.isArray(tags)
                ? tags.map(Number)
                : tags ? [Number(tags)] : [];

            const links = data.urls ?? [];
            const urls = Array.isArray(links) ?
                links.map(String) :
                [String(links)]
            console.log(data)
            const newPost = await client.post_app_post.create({
                data: {
                    title: data.title,
                    topic: data.topic,
                    content: data.content,
                    authorId: Number(data.authorId),

                    photos: {
                        create: photos
                    },

                    tags: {
                        create: tagIds.map(tagId => ({
                            tag: {
                                connect: { id: tagId }
                            }
                        }))
                    },

                    
                    urls: {
                    create: urls.map((href) => ({
                        href: href
                    }))
                    }
                },
                include: {
                    author: true,
                    urls: true,
                    photos: true,
                    tags: true,
                },
            });

            return newPost;
        } catch (error) {
            throw error;
        }
    },

    updatePost: async (
        postId: number,
        data: UpdatePostDto,
        files?: Express.Multer.File[]
    ) => {
        try {
            const photos = files?.map(file => ({
                original_image: file.filename
            })) ?? [];

            const tags = data.tags ?? [];

            const tagIds = Array.isArray(tags)
                ? tags.map(Number)
                : tags ? [Number(tags)] : [];

            const links = data.urls ?? [];

            const urls = Array.isArray(links)
                ? links.map(String)
                : links ? [String(links)] : [];

            const updateData: Prisma.post_app_postUpdateInput = {};

            if (data.title !== undefined) {
                updateData.title = data.title;
            }

            if (data.topic !== undefined) {
                updateData.topic = data.topic;
            }

            if (data.content !== undefined) {
                updateData.content = data.content;
            }

            if (data.authorId !== undefined) {
                updateData.author = {
                    connect: {
                        id: Number(data.authorId)
                    }
                };
            }

            updateData.photos = {
                deleteMany: {},
                create: photos
            };

            updateData.tags = {
                deleteMany: {},
                create: tagIds.map(tagId => ({
                    tag: {
                        connect: {
                            id: tagId
                        }
                    }
                }))
            };

            updateData.urls = {
                deleteMany: {},
                create: urls.map(href => ({
                    href
                }))
            };

            return await client.post_app_post.update({
                where: {
                    id: postId
                },

                data: updateData,

                include: {
                    author: true,
                    urls: true,
                    photos: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Repo Error:", error);
            throw error;
        }
    },

    deletePost: async (postId: number): Promise<{ message: string } | string> => {
        try {
            await client.$transaction([
                client.post_app_post_tags.deleteMany({ where: { postId } }),
                client.post_app_postlink.deleteMany({ where: { postId } }),
                client.post_app_post.delete({ where: { id: postId } })
            ]);

            return { message: "Post successfully deleted" };
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return "Post not found";
            }
            console.error(error);
            return "Failed to delete post from database";
        }
    },
    getPostsByUserId: async (userId) => {
        return await client.post_app_post.findMany({
            where: {
                authorId: userId
            },
            include: {
                author: {
                    include:{
                        user: true
                    }
                },
                urls: true,
                photos: true,
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        })
    }
}