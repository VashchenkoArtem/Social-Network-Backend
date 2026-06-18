import { IFriendsRepositoryContract } from './friends.types'
import { Prisma } from "@prisma/client";
import { client } from "../client/client";

export const friendsRepository: IFriendsRepositoryContract = {
    getAllFriends: async (userId) => {
        try {
            const friends = await client.user_app_friendship.findMany({
                where: {
                    OR: [
                        { from_user_id: userId },
                        { to_user_id: userId }
                    ],
                    status: "accepted"
                },
                // take: 2,
                select: {
                    id: true,

                    user_app_user_user_app_friendship_from_user_idTouser_app_user: {
                        include: {
                            profile_app_profile: true
                        }
                    },

                    user_app_user_user_app_friendship_to_user_idTouser_app_user: {
                        include: {
                            profile_app_profile: true
                        }
                    }
                }
            });
            return friends.map((friendship) => {
                const isCurrentUserSender =
                    friendship
                        .user_app_user_user_app_friendship_from_user_idTouser_app_user
                        .id === BigInt(userId);

                const user = isCurrentUserSender
                    ? friendship.user_app_user_user_app_friendship_to_user_idTouser_app_user
                    : friendship.user_app_user_user_app_friendship_from_user_idTouser_app_user;

                return {
                    id: Number(friendship.id.toString()),
                    user
                };
            });

        } catch (error) {
            throw error;
        }
    },
    
    getAllRequests: async (userId, paginationData) => {
        try {
            const limit = paginationData.limit ?? 3
            const requests = await client.user_app_friendship.findMany({
                where: {
                    to_user_id: userId,
                    status: "pending"
                },
                orderBy: [
                    { id: "desc" },
                ],                
                take: limit + 1,
                ...(paginationData.cursor
                    ? {
                        cursor: {
                            id: paginationData.cursor,
                        },
                        skip: 1,
                    }
                    : {}),
                include: {
                    user_app_user_user_app_friendship_from_user_idTouser_app_user: {
                        include: {
                            profile_app_profile: true
                        }
                    },

                    user_app_user_user_app_friendship_to_user_idTouser_app_user: {
                        include: {
                            profile_app_profile: true
                        }
                    }
                }
            });

            const hasMore = requests.length > limit
            const data = hasMore ? requests.slice(0, limit) : requests
            const nextCursor = hasMore ? requests[limit - 1]?.id ?? null : null

            return {
                data: data.map((request) => {
                    const isCurrentUserSender =
                        request.from_user_id === BigInt(userId);
    
                    const user = isCurrentUserSender
                        ? request.user_app_user_user_app_friendship_to_user_idTouser_app_user
                        : request.user_app_user_user_app_friendship_from_user_idTouser_app_user;
    
                    return {
                        id: Number(request.id.toString()),
                        user
                    };
                }),
                meta: {
                    nextCursor: Number(nextCursor?.toString()),
                    hasMore
                }
            }
        } catch (error) {
            throw error
        }
    },

    createFriendRequest: async (senderId, receiverId) => {
        try {
            const request = await client.user_app_friendship.create({
                data : {
                    from_user_id: senderId,
                    to_user_id: receiverId,
                    status: "pending",
                    created_at: new Date(Date.now())
                }
            })
            return request
        } catch (error) {
            throw error
        }
    },

    updateFriendRequestStatus: async (data) => {
        try {
            const { requestId, ...requestData} = data
            const updatedRequest = await client.user_app_friendship.update({
                where: {
                    id: requestId
                },
                data: requestData
            })
            return updatedRequest
        } catch (error) {
            throw error
        }
    },

    deleteFriendRequest: async (requestId) => {
        try {
            const deletedRequest = await client.user_app_friendship.delete({
                where: {
                    id: requestId
                }
            })
            return deletedRequest
        } catch (error) {
            throw error
        }
    },
    recommendedPeople: async (userId, paginationData) => {
        const limit = paginationData.limit ?? 3
        const friendships = await client.user_app_friendship.findMany({
            where: {
                OR: [
                    { from_user_id: BigInt(userId) },
                    { to_user_id: BigInt(userId) },
                ],
            },            
            select: {
                from_user_id: true,
                to_user_id: true,
            },
        });

        const excludedUserIds = new Set<number>();

        friendships.forEach(f => {
            const from = Number(f.from_user_id);
            const to = Number(f.to_user_id);

            if (from === userId) excludedUserIds.add(to);
            else excludedUserIds.add(from);
        });

        const users = await client.user_app_user.findMany({
            where: {
                id: {
                    notIn: [userId, ...Array.from(excludedUserIds)],
                },
            },
            orderBy: [
                // { created_at: "desc" },
                { id: "desc" },
            ],
            take: limit + 1,
            ...(paginationData.cursor
                ? {
                    cursor: {
                        id: paginationData.cursor,
                    },
                    skip: 1,
                }
                : {}),
            // take: 2,
            include: {
                profile_app_profile: true,
            },
        });
        const hasMore = users.length > limit
        const data = hasMore ? users.slice(0, limit) : users
        const nextCursor = hasMore
            ? users[limit - 1]?.id ?? null
            : null
        return {
            data,
            meta: {
                nextCursor: Number(nextCursor?.toString()),
                hasMore
            }
        }
    }
}