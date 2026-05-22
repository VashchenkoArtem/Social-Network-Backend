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
                            }
                        }
                    }
                }
            }
        });
    }
};