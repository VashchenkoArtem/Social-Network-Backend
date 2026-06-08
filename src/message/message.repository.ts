import { client } from "../client/client";
import { IMessageRepositoryContract } from "./message.types";

export const MessageRepository: IMessageRepositoryContract = {
    getMessages: async (chatId) => {
        try {
            const messages = await client.chat_app_message.findMany({
                where: {
                    chat_id: chatId
                },
                orderBy: {
                    created_at: 'desc'
                }
                ,
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
                    }
                }
            })
            return messages
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

        return await client.chat_app_message.create({
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