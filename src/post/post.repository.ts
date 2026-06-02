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
                take: take !== undefined ? take : 3,
                orderBy: {
                    created_at: "desc"
                },
                include: {
                    user_app_user: {
                        include: {
                            profile_app_profile: true
                        }
                    },
                    post_app_postlink: true,
                    post_app_postimage: true,
                    post_app_post_tags: {
                        include: {
                            post_app_tag: true
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
                    author_id: userId
                },
                orderBy: {
                    created_at: "desc"
                },
                take: 3,
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
                    }
                }
            })
        } catch (error) {
            throw error
        }
    },
    
    createPost: async (data, files) => {
        try {
            const photos = files?.map(file => ({
                original_image: file.filename,
                compressed_image: file.filename
            })) ?? [];

            // ВИПРАВЛЕНО: Читаємо "tags", як їх відправляє мобільний додаток
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
                        // ВИПРАВЛЕНО: Переконуємось, що id є BigInt
                        create: tagIds.map(tagId => ({
                            post_app_tag: {
                                connect: { id: BigInt(tagId) }
                            }
                        }))
                    },
                    post_app_postlink: {
                        create: urls.map((href) => ({
                            url: href
                        }))
                    }
                },
                include: {
                    user_app_user: true,
                    post_app_postlink: true,
                    post_app_postimage: true,
                    post_app_post_tags: true,
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
                        id: Number(data.authorId)
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
                }
            }
        })
    }
}