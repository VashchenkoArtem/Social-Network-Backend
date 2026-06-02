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
                            username: true,
                            profile_app_profile: {
                                select: {
                                    id: true,
                                    avatar: true
                                }
                            }
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
        try {
            const newMessage = await client.chat_app_message.create({
                data,
                include: {
                    user_app_user: {
                        select: {
                            id: true,
                            username: true,
                            profile_app_profile: {
                                select: {
                                    id: true,
                                    avatar: true
                                }
                            }
                        } 
                    }
                }
            })
            return newMessage
        } catch (error) {
            throw error
        }
    },
    
    getAllUnreadMessages: async (userId) => {
        try {
            const unreadMessages = await client.chat_app_message.count({
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
            const readStatus = unreadMessages.map((message) => {
                return client.chat_app_message_readers.create({
                    data: {
                        message_id: message.id,
                        user_id: userId
                    }
                })
            })
            return 'Status was changed to read'
        } catch (error) {
            throw error
        }
    },

    getAllUnreadChatMessages: async (chatId, userId) => {
        try {
            console.log(userId)
            const unreadChatMessages = await client.chat_app_message.count({
                where: {
                    sender_id: {
                        not: userId
                    },
                    chat_app_chat: {
                        chat_app_message:{
                            some: {
                                chat_id: chatId
                            }
                        },
                        chat_app_chat_users: {
                            some: {
                                user_id: Number(userId)
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
            return unreadChatMessages
        } catch (error) {
            throw error
        }
    },
    
}