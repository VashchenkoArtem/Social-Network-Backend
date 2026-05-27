import { IFriendsRepositoryContract } from './types/friends.types'
import { Prisma } from "@prisma/client";
import { client } from "../client/client";

export const friendsRepository: IFriendsRepositoryContract = {
    getAllFriends: async (userId) => {
        try {
            const friends = await client.user_app_friendship.findMany({
                where: {
                    OR: [
                        { from_user_id: userId},
                        { to_user_id: userId}
                    ],
                    status: "Accepted"
                },
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
            })
            return friends
        } catch (error) {
            throw error
        }
    },
    
    getAllRequests: async (userId) => {
        try {
            const requests = await client.user_app_friendship.findMany({
                where: {
                    to_user_id: userId,
                    status: "Pending"
                },
                include: {
                    user_app_user_user_app_friendship_from_user_idTouser_app_user: {
                        include: {
                            profile_app_profile: true
                        }
                    }
                }
            })
            return requests
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
                    status: "Pending",
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
    recommendedPeople: async (userId) =>{
        const users = await client.user_app_user.findMany({
            where: {
                NOT: {
                    OR: [
                        {
                            user_app_friendship_user_app_friendship_to_user_idTouser_app_user: {
                                some: {
                                    id: userId
                                }
                            }
                        },
                        {
                            user_app_friendship_user_app_friendship_from_user_idTouser_app_user: {
                                some: {
                                    id: userId
                                }
                            }
                        }
                    ]
                },
                id: {
                    not: userId
                }
            },

            include: {
                profile_app_profile: true
            }
        })

        return users
    }
}