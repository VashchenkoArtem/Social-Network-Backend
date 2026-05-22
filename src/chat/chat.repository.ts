import { client } from "../client/client";
import { IChatRepositoryContract } from "./chat.types";


export const ChatRepository: IChatRepositoryContract = {
    getGroupChats: async (userId) => {
        return await client.chat_app_chat.findMany({
            where: {
                users: { some: { userId: userId } },
                is_group: true
            },
            include: {
                users: {
                    include: {
                        user: {
                            include: {
                                profile: true
                            }
                        }
                    }
                }
            }
        });
    },

    getPersonalChats: async (userId) => {
        return await client.chat_app_chat.findMany({
            where: {
                users: { some: { userId: userId } },
                is_group: false
            },
            include: {
                users: {
                    include: {
                        user: {
                            include: {
                                profile: true
                            }
                        }
                    }
                }
            }
        });
    },

    createGroupChat: async (adminId, data, filename) => {
        const cleanAdminId = Number(adminId);
        const cleanUserIds = data.userIds.map(id => Number(id));

        const pureUserIds = cleanUserIds.filter((id) => id !== cleanAdminId);

        const allUniqueUserIds = Array.from(new Set([cleanAdminId, ...pureUserIds]));

        return await client.chat_app_chat.create({
            data: {
                name: data.name,
                is_group: true,
                avatar: filename || "default-group-avatar.png",
                adminId: cleanAdminId,
                users: {
                    create: allUniqueUserIds.map((id) => ({ userId: id }))
                }
            },
            include: {
                users: {
                    include: {
                        user: {
                            include: {
                                profile: true
            }}}}}})
    },
    updateChat: async (chatId, data) => {
        try {
            const chat = await client.chat_app_chat.update({
                where: { id: chatId },
                data,
                include: {
                    users: {
                        include: {
                            user: {
                                include: {
                                    profile: true
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

    findChatById: async (chatId) => {
        try {
            const chat = await client.chat_app_chat.findUnique({
                where: { id: chatId },
                include: {
                    users: {
                        include: {
                            user: {
                                include: {
                                    profile: true
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
    }
}
