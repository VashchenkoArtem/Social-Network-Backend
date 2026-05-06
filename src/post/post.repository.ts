import { IPostRepositoryContract } from "./post.types";
import { client } from "../client/client";
import { url } from "envalid";

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
}