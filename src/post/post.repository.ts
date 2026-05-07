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
            const posts = await client.post.findMany({
                take: take !== undefined ? take : 5,

                include: {
                    author: {
                        include: {
                            avatars: true
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
            return await client.post.findMany({
                where: {
                    authorId: userId
                },
                include: {
                    author: {
                        include: {
                            avatars: true
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
                filename: file.filename
            })) ?? [];

            const tags = data.tags ?? [];

            const tagIds = Array.isArray(tags)
                ? tags.map(Number)
                : tags ? [Number(tags)] : [];

            const links = data.urls ?? [];
            const urls = Array.isArray(links) ?
                links.map(String) :
                [String(links)]
            console.log(urls)
            const newPost = await client.post.create({
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
                    author: {
                        include: {
                            avatars: true,
                        },
                    },
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

    updatePost: async (postId: number, data: UpdatePostDto, files?: Express.Multer.File[]) => {
        try {
            const { tags, urls, authorId, existingPhotos, ...rest } = data;
            const updateData: Prisma.PostUpdateInput = {};

            if (rest.title) updateData.title = rest.title;
            if (rest.content) updateData.content = rest.content;
            if (rest.topic !== undefined) updateData.topic = rest.topic;

            if (authorId) {
                updateData.author = { connect: { id: Number(authorId) } };
            }

            const remainingPhotoNames = (Array.isArray(existingPhotos) 
                ? existingPhotos 
                : [existingPhotos]
            )
            .filter(Boolean)
            .map(uri => uri!.split('/').pop() as string);

            const newPhotoNames = files?.map(f => f.filename).filter((n): n is string => !!n) || [];
            
            const finalPhotoList = [...remainingPhotoNames, ...newPhotoNames];

            updateData.photos = {
                deleteMany: {},
                create: finalPhotoList.map(filename => ({ filename }))
            };

            if (tags) {
                updateData.tags = {
                    deleteMany: {},
                    create: (Array.isArray(tags) ? tags : [tags])
                        .map(id => Number(id))
                        .filter(id => !isNaN(id))
                        .map(id => ({ tag: { connect: { id } } }))
                };
            }

            if (urls) {
                updateData.urls = {
                    deleteMany: {},
                    create: (Array.isArray(urls) ? urls : [urls]).map(href => ({ href: String(href) }))
                };
            }

            return await client.post.update({
                where: { id: postId },
                data: updateData,
                include: {
                    photos: true,
                    tags: { include: { tag: true } },
                    author: { include: { avatars: true } },
                    urls: true,
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
                client.tagOnPost.deleteMany({ where: { postId } }),
                client.postUrl.deleteMany({ where: { postId } }),
                client.post.delete({ where: { id: postId } })
            ]);

            return { message: "Post successfully deleted" };
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return "Post not found";
            }
            console.error(error);
            return "Failed to delete post from database";
        }
    }
}