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
    }
}