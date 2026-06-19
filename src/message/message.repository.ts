import { client } from "../client/client";
import { IMessageRepositoryContract } from "./message.types";

export const MessageRepository: IMessageRepositoryContract = {
    getMessages: async (chatId, paginationData) => {
        try {
            const limit = Math.min(Math.max(paginationData.limit ?? 20, 1), 50)
            const messages = await client.chat_app_message.findMany({
                where: {
                    chat_id: chatId
                },
                orderBy: [
                    {
                        created_at: "desc",
                    },
                    {
                        id: "desc",
                    },
                ],
                take: limit + 1,
                ...(paginationData.cursor
                    ? {
                        cursor: { id: paginationData.cursor },
                        skip: 1,
                    }
                    : {}),
                include: {
                    user_app_user: {
                        select: {
                            id: true,
                            profile_app_profile: {
                                select: {
                                    id: true,
                                    avatar: true,
                                    pseudonym: true
                                }
                            }
                        }
                    },
                    chat_app_messageimage: {
                        select: {
                            id: true,
                            image: true
                        }
                    },
                    chat_app_message_readers: {
                        select: {
                            user_id: true
                        }
                    }
                }
            })
            const hasMore = messages.length > limit
            const data = hasMore ? messages.slice(0, limit) : messages
            const nextCursor = hasMore ? data[data.length - 1]?.id ?? null : null
            return {
                messages: data,
                meta: {
                    nextCursor: Number(nextCursor),
                    hasMore
                }
            }
        } catch (error) {
            throw error
        }
    },

    getAllMessagesByChatId: async(chatId) => {
        try {
            const messages = await client.chat_app_message.findMany({
                where: {
                    chat_id: chatId
                },
            })

            return messages
        } catch (error) {
            throw error
        }
    },

    createMessage: async (data) => {
        const { photos, ...messageData } = data;
        const createData: any = {
            ...messageData,
        };

        if (photos?.length) {
            createData.chat_app_messageimage = {
                create: photos.map((photo: string) => ({
                    image: photo,
                }))
            };
        }

        const message = await client.chat_app_message.create({
            data: createData,

            include: {
                user_app_user: {
                    select: {
                        id: true,
                        username: true,
                        profile_app_profile: {
                            select: {
                                id: true,
                                avatar: true,
                            },
                        },
                    },
                },

                
            },
        });
        return message
    },
    
    getAllUnreadMessages: async (userId, is_group) => {
        try {
            const unreadMessages = await client.chat_app_message.count({
                where: {
                    sender_id: {
                        not: userId
                    },
                    chat_app_chat: {
                        is_group: is_group,
                        chat_app_chat_users: {
                            some: {
                                user_id: userId
                            }
                        }
                    },
                    chat_app_message_readers: {
                        none: {
                            user_id: userId
                        }
                    }
                }
            })
            return unreadMessages
        } catch (error) {
            throw error
        }
    },

    markAsRead: async (chatId, userId) => {
        try {
            const unreadMessages = await client.chat_app_message.findMany({
                where: {
                    chat_id: chatId,
                    sender_id: {
                        not: userId
                    },
                    chat_app_message_readers: {
                        none: {
                            user_id: userId
                        }
                    }
                }
            })
            await Promise.all(
                unreadMessages.map((message) =>
                    client.chat_app_message_readers.create({
                        data: {
                            message_id: message.id,
                            user_id: userId
                        }
                    })
                )
            )
            return 'Status was changed to read'
        } catch (error) {
            throw error
        }
    },

    getAllUnreadChatMessages: async (userId) => {
        try {
            console.log(userId)
            const unread = await client.chat_app_message.groupBy({
                by: ["chat_id"],
                where: {
                    sender_id: {
                        not: userId
                    },

                    chat_app_chat: {
                        chat_app_chat_users: {
                            some: {
                                user_id: userId
                            }
                        }
                    },

                    chat_app_message_readers: {
                        none: {
                            user_id: userId
                        }
                    }
                },
                _count: {
                    _all: true
                }
            });
            const unreadMap = Object.fromEntries(
                unread.map(item => [item.chat_id, item._count._all])
            );
            return unreadMap
        } catch (error) {
            throw error
        }
    },
    
}