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

    createFriendRequest: async (data) => {
        try {
            const request = await client.user_app_friendrequest.create({
                data : data
            })
            return request
        } catch (error) {
            throw error
        }
    },

    updateFriendRequestStatus: async (requestId, data) => {
        try {
            const updatedRequest = await client.user_app_friendrequest.update({
                where: {
                    id: requestId
                },
                data: data
            })
            return updatedRequest
        } catch (error) {
            throw error
        }
    },
}