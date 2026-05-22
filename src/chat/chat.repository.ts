import { client } from "../client/client";
import { IChatRepositoryContract } from "./chat.types";

export const ChatRepository: IChatRepositoryContract = {
    getGroupChats: async(userId) => {
        try {
            const groupChats = await client.chat_app_chat.findMany({
                where: {
                    users: {
                        some: {
                            userId: userId
                        }
                    },
                    is_group: true
                },
                include: {
                    users: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    profile: {
                                        select: {
                                            avatar: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            return groupChats
        } catch (error) {
            throw error
        }
    },

    getPersonalChats: async(userId) => {
        try {
            const personalChats = await client.chat_app_chat.findMany({
                where: {
                    users: {
                        some: {
                            userId: userId
                        }
                    },
                    is_group: false
                },
                include: {
                    users: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    profile: {
                                        select: {
                                            avatar: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            return personalChats
        } catch (error) {
            throw error
        }
    },

    createChat: async (data, userId) => {
        try {
            const chat = await client.chat_app_chat.create({
                data: {
                    ...(data.name && { name: data.name }),
                    is_group: data.is_group,
                    users: {
                        create: [
                            { userId },
                            ...data.userIds.map((id) => ({ userId: id }))
                        ]
                    }
                } as any,
                include: {
                    users: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    profile: { select: { avatar: true } }
                                }
                            }
                        }
                    }
                }
            })
            return chat
        } catch (error) {
            throw error
        }
    },

    updateChat: async (chatId, data) => {
        try {
            const chat = await client.chat_app_chat.update({
                where: { id: chatId },
                data,
                include: {
                    users: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    profile: { select: { avatar: true } }
                                }
                            }
                        }
                    }
                }
            })
            return chat
        } catch (error) {
            throw error
        }
    },

    deleteChat: async (chatId) => {
        try {
            await client.chat_app_chat.delete({
                where: { id: chatId }
            })
        } catch (error) {
            throw error
        }
    },

    leaveChat: async (userId) => {
        try {
            await client.chat_app_chat_users.deleteMany({
                where: { userId }
            })
        } catch (error) {
            throw error
        }
    },
}