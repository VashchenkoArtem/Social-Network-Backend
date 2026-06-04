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
                take: 2,
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
    
    getAllRequests: async (userId) => {
        try {
            const requests = await client.user_app_friendship.findMany({
                where: {
                    to_user_id: userId,
                    status: "pending"
                },
                take: 2,
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

            return requests.map((request) => {
                const isCurrentUserSender =
                    request.from_user_id === BigInt(userId);

                const user = isCurrentUserSender
                    ? request.user_app_user_user_app_friendship_to_user_idTouser_app_user
                    : request.user_app_user_user_app_friendship_from_user_idTouser_app_user;

                return {
                    id: Number(request.id.toString()),
                    user
                };
            });

        } catch (error) {
            throw error;
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
            console.log(updatedRequest)
            return updatedRequest
        } catch (error) {
            throw error
        }
    },

    deleteFriendRequest: async (requestId) => {
        try {
            console.log(requestId)
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
    recommendedPeople: async (userId) => {
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
            take: 2,
            include: {
                profile_app_profile: true,
            },
        });
        return users;
    }
}