import { 
    IPostRepositoryContract, 
    Post, 
    UpdatePostDto, 
    CreatePost 
} from "./post.types";
import { Prisma } from "@prisma/client";
import { client } from "../client/client";
import cloudinary from "../config/cloudinary";

export const postRepository: IPostRepositoryContract = {
    getAllPosts: async (paginationData) => {
        try  {
            const limit = paginationData.limit ?? 3
            const posts = await client.post_app_post.findMany({
                orderBy: [
                    { created_at: "desc" },
                    { id: "desc" },
                ],
                take: limit + 1,
                ...(paginationData.cursor
                    ? {
                        cursor: {
                            id: paginationData.cursor,
                        },
                        skip: 1,
                    }
                    : {}),
                include: {
                    user_app_user: {
                        include: {
                            profile_app_profile: {
                                select: {
                                    id: true,
                                    avatar: true,
                                    pseudonym: true,
                                    signature: true
                                }
                            },
                        },
                    },
                    post_app_postlink: true,
                    post_app_postimage: true,
                    post_app_post_tags: {
                        include: {
                            post_app_tag: true,
                        },
                    },
                    _count: {
                        select: {
                            post_app_postlike: true,
                            post_app_postheart: true,
                            post_app_postview: true,
                        }
                    }
                },
            });

            const hasMore = posts.length > limit;
            const data = hasMore ? posts.slice(0, limit) : posts;

            const nextCursor = hasMore
                ? data[data.length - 1]?.id ?? null
                : null;
            return {
                data,
                meta: {
                    nextCursor: Number(nextCursor?.toString()),
                    hasMore,
                },
            };
        } catch (error) {
            throw error
        }
    },
    
    getMyPosts: async (userId, paginationData) => {
        try {
            const limit = paginationData.limit ?? 3
            const userPosts = await client.post_app_post.findMany({
                where: {
                    author_id: userId
                },

                orderBy: [
                    { created_at: "desc" },
                    { id: "desc" },
                ],
                // orderBy: {
                //     created_at: "desc"
                // },
                take: limit + 1,
                ...(paginationData.cursor
                    ? {
                        cursor: {
                            id: paginationData.cursor,
                        },
                        skip: 1,
                    }
                    : {}),
                include: {
                    user_app_user: {
                        include:{
                            profile_app_profile: true
                        }
                    },
                    post_app_postlink: true,
                    post_app_postimage: true,
                    post_app_post_tags: {
                        include: {
                            post_app_tag: true
                        }
                    },
                    _count: {
                        select: {
                            post_app_postlike: true,
                            post_app_postheart: true,
                            post_app_postview: true
                        }
                    }
                }
            })

            const hasMore = userPosts.length > limit;
            const data = hasMore ? userPosts.slice(0, limit) : userPosts;

            const nextCursor = hasMore
                ? data[data.length - 1]?.id ?? null
                : null;
            return {
                data,
                meta: {
                    nextCursor: Number(nextCursor?.toString()),
                    hasMore,
                },
            };
        } catch (error) {
            throw error
        }
    },
    
    createPost: async (data, files) => {
        try {
            const photos = files?.map(file => {
                console.log(file.filename)
                return {
                    original_image: file.filename,
                    compressed_image: file.filename
                }
            }) ?? [];
            const tags = data.tags ?? [];

            const tagIds = Array.isArray(tags)
                ? tags.map(Number)
                : tags ? [Number(tags)] : [];

            const links = data.urls ?? [];
            const urls = Array.isArray(links) ?
                links.map(String) :
                links ? [String(links)] : [];

            const newPost = await client.post_app_post.create({
                data: {
                    title: data.title,
                    topic: data.topic ?? null,
                    content: data.content,
                    author_id: BigInt(data.author_id),
                    created_at: new Date(Date.now()),
                    post_app_postimage: {
                        create: photos
                    },
                    post_app_post_tags: {
                        create: tagIds.map(tagId => ({
                            tag_id: BigInt(tagId)
                        }))
                    },
                    post_app_postlink: {
                        create: urls.map((href) => ({
                            url: href
                        }))
                    }
                },
                include: {
                    user_app_user: {
                        include: {
                            profile_app_profile: {
                                select: {
                                    id: true,
                                    avatar: true,
                                    pseudonym: true,
                                    signature: true
                                }
                            },
                        },
                    },
                    post_app_postlink: true,
                    post_app_postimage: true,
                    post_app_post_tags: {
                        include: {
                            post_app_tag: true,
                        },
                    },
                },
            });

            return newPost;
        } catch (error) {
            throw error;
        }
    },

    updatePost: async (
        postId,
        data: UpdatePostDto,
        files?: Express.Multer.File[]
    ) => {
        try {
            const photos = files?.map(file => ({
                original_image: file.filename,
                compressed_image: file.filename
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
                updateData.user_app_user = {
                    connect: {
                        id: BigInt(data.authorId)
                    }
                };
            }

            updateData.post_app_postimage = {
                deleteMany: {},
                create: photos
            };

            updateData.post_app_post_tags = {
                deleteMany: {},
                // ВИПРАВЛЕНО: Додано BigInt(tagId), інакше оновлення падало з помилкою типу
                create: tagIds.map(tagId => ({
                    post_app_tag: {
                        connect: {
                            id: BigInt(tagId) 
                        }
                    }
                }))
            };

            updateData.post_app_postlink = {
                deleteMany: {},
                create: urls.map(href => ({
                    url: href
                }))
            };

            return await client.post_app_post.update({
                where: {
                    id: postId
                },
                data: updateData,
                include: {
                    user_app_user: true,
                    post_app_postlink: true,
                    post_app_postimage: true,
                    post_app_post_tags: {
                        include: {
                            post_app_tag: true
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Repo Error:", error);
            throw error;
        }
    },

    deletePost: async (postId): Promise<{ message: string } | string> => {
        try {
            
            await client.$transaction([
                client.post_app_post_tags.deleteMany({ where: { post_id: BigInt(postId)  } }),
                client.post_app_postlink.deleteMany({ where: { post_id: BigInt(postId) } }),
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
                author_id: userId
            },
            include: {
                user_app_user: {
                    include:{
                        profile_app_profile: true
                    }
                },
                post_app_postlink: true,
                post_app_postimage: true,
                post_app_post_tags: {
                    include: {
                        post_app_tag: true
                    }
                },
                _count: {
                    select: {
                        post_app_postlike: true,
                        post_app_postheart: true,
                        post_app_postview: true
                    }
                }
            }
        })
    },
    viewPost: async (postId, userId) => {
        try {
            await client.post_app_postview.upsert({
                where: {
                    user_id_post_id: {
                        user_id: userId,
                        post_id: postId,
                    },
                },
                update: {},
                create: {
                    post_id: postId,
                    user_id: userId,
                },
            });

            return { message: "View registered successfully" };
        } catch (error) {
            console.error("Repo Error (viewPost):", error);
            throw error;
        }
    },
}