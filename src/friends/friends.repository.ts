import { IFriendsRepositoryContract } from './friends.types'
import { Prisma } from "@prisma/client";
import { client } from "../client/client";

export const friendsRepository: IFriendsRepositoryContract = {
    getAllFriends: async (userId) => {
        try {
            const friends = await client.user_app_friendrequest.findMany({
                where: {
                    OR: [
                        { senderId: userId},
                        { receiverId: userId}
                    ],
                    status: "Accepted"
                },
                include: {
                    from_profile: {
                        include: {
                            profile: true
                        }
                    },
                    to_profile: {
                        include: {
                            profile: true
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
            const requests = await client.user_app_friendrequest.findMany({
                where: {
                    receiverId: userId,
                    status: "Pending"
                },
                include: {
                    from_profile: {
                        include: {
                            profile: true
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
            const request = await client.user_app_friendrequest.create({
                data : {
                    senderId: Number(senderId),
                    receiverId: receiverId,
                    status: "Pending"
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
            const updatedRequest = await client.user_app_friendrequest.update({
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
            const deletedRequest = await client.user_app_friendrequest.delete({
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
                        // я отправил запрос
                        {
                            receivedFriendRequests: {
                                some: {
                                    senderId: userId
                                }
                            }
                        },

                        // мне отправили запрос
                        {
                            sentFriendRequests: {
                                some: {
                                    receiverId: userId
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
                profile: true
            }
        })

        return users
    }
}