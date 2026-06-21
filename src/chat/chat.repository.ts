import { client } from "../client/client";
import cloudinary from "../config/cloudinary";
import { IChatRepositoryContract } from "./types/chat.contracts";

export const ChatRepository: IChatRepositoryContract = {
    getGroupChats: async (userId, paginationData) => {
        const limit = Math.min(Math.max(paginationData.limit ?? 20, 1), 50)
        const groupChat = await client.chat_app_chat.findMany({
            where: {
                chat_app_chat_users: {
                    some: {
                        user_id: userId
                    }
                },
                is_group: true
            },
            orderBy: {
                id: 'desc'
            },
            take: 10,
            ...(paginationData.cursor
                ? {
                    cursor: { id: paginationData.cursor },
                    skip: 1,
                }
                : {}),
            include: {
                chat_app_chat_users: {
                    where: {
                        NOT: {
                            user_id: userId
                        }
                    },
                    select: {
                        id: true,
                        chat_id: true,
                        user_id: true,
                        user_app_user: {
                            select: {
                                id: true,
                                username: true,
                                profile_app_profile: {
                                    select: {
                                        id: true,
                                        avatar: true,
                                        pseudonym: true
                                    }
                                    
                                }
                            }
                        }
                    }
                }
            }
        });

        const hasMore = groupChat.length > limit
        const data = hasMore ? groupChat.slice(0, limit) : groupChat
        const nextCursor = hasMore ? data[data.length - 1]?.id ?? null : null
        return {
            chats: data,
            meta: {
                nextCursor: Number(nextCursor),
                hasMore
            }
        }
    },

    getPersonalChats: async (userId, paginationData) => {
        const limit = Math.min(Math.max(paginationData.limit ?? 20, 1), 50)
        const personalChats = await client.chat_app_chat.findMany({
            where: {
                chat_app_chat_users: {
                    some: {
                        user_id: userId
                    }
                },
                is_group: false
            },
            orderBy: {
                id: 'desc',
            },
            take: 10,
            ...(paginationData.cursor
                ? {
                    cursor: { id: paginationData.cursor },
                    skip: 1,
                }
                : {}),
            include: {
                chat_app_chat_users: {
                    where: {
                        NOT: {
                            user_id: userId
                        }
                    },
                    select: {
                        id: true,
                        chat_id: true,
                        user_id: true,

                        user_app_user: {
                            select: {
                                id: true,
                                username: true,

                                profile_app_profile: {
                                    select: {
                                        id: true,
                                        avatar: true,
                                        pseudonym: true
                                    }
                                }
                            }
                        }
                    }
                },

                chat_app_message: {
                    take: 1,

                    orderBy: {
                        created_at: "desc"
                    },

                    select: {
                        id: true,
                        text: true,
                        created_at: true,
                        sender_id: true
                    }
                }
            }
        });
        console.log(personalChats)
        const hasMore = personalChats.length > limit
        const data = hasMore ? personalChats.slice(0, limit) : personalChats
        const nextCursor = hasMore ? data[data.length - 1]?.id ?? null : null
        return {
            chats: data,
            meta: {
                nextCursor: Number(nextCursor),
                hasMore
            }
        }
    },

    createChat: async (adminId, data, filename) => {
        const cleanAdminId = Number(adminId);
        const cleanUserIds = data.userIds.map(id => Number(id));

        const pureUserIds = cleanUserIds.filter((id) => id !== cleanAdminId);

        const allUniqueUserIds = Array.from(new Set([cleanAdminId, ...pureUserIds]));
        const avatar = filename ? cloudinary.url(filename) : "default-group-avatar.png";
        return await client.chat_app_chat.create({
            data: {
                name: data.name,
                is_group: data.is_group || false,
                avatar: avatar,
                admin_id: cleanAdminId,
                chat_app_chat_users: {
                    create: allUniqueUserIds.map((id) => ({ user_id: BigInt(id) }))
                }
            },
            include: {
                chat_app_chat_users: {
                    include: {
                        user_app_user: {
                            include: {
                                profile_app_profile: true
            }}}}}})
    },
    updateChat: async (chatId, data, filename) => {
        try {
            const { userIds, ...safeData } = data;

            const chat = await client.chat_app_chat.update({
                where: { id: chatId },
                data: {
                    name: safeData.name,
                    ...(filename !== null ? { avatar: cloudinary.url(filename) } : {}),
                },
                include: {
                    chat_app_chat_users: {
                        include: {
                            user_app_user: {
                                include: {
                                    profile_app_profile: true
                                }
                            }
                        }
                    }
                }
            });

            return chat;
        } catch (error) {
            throw error;
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

    leaveChat: async (userId, chatId) => {
        await client.chat_app_chat_users.deleteMany({
            where: { 
                user_id: BigInt(userId),
                chat_id: chatId
            }
        });
    },

    findChatById: async (chatId) => {
        try {
            const chat = await client.chat_app_chat.findUnique({
                where: { id: chatId },
                include: {
                    chat_app_chat_users: {
                        include: {
                            user_app_user: {
                                include: {
                                    profile_app_profile: true
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
    getChatParticipants: async (chatId) => {
		const participants = await client.chat_app_chat.findUnique({
			where: {
				id: chatId,
			},
			select: {
				chat_app_chat_users: {
                    select: {
                        id: true,
                        user_app_user: true
                    }
                },
			},
		});
		return participants;
	},
    getChatByParticipants: async (userId, participantId) => {
        const chat = await client.chat_app_chat.findFirst({
            where: {
                is_group: false,
                AND: [
                    {
                        chat_app_chat_users: {
                            some: {
                                user_id: BigInt(userId),
                            },
                        },
                    },
                    {
                        chat_app_chat_users: {
                            some: {
                                user_id: BigInt(participantId),
                            },
                        },
                    },
                ],
            },
            include: {
                chat_app_chat_users: {
                    include: {
                        user_app_user: {
                            include: {
                                profile_app_profile: true,
                            },
                        },
                    },
                },
            },
    })
    return chat
    },
}
