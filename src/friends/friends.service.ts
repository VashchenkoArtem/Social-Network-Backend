import { friendsRepository } from "./friends.repository";
import { IFriendsServiceContract } from "./friends.types";

export const friendsService : IFriendsServiceContract = {
    getAllFriends: async(userId) => {
        const friends = await friendsRepository.getAllFriends(userId)
        return friends
    },
    getAllRequests: async(userId, take) => {
        const requests = await friendsRepository.getAllRequests(userId, take)
        return requests
    },
    createFriendRequest: async(senderId, receiverId) => {
        const request = await friendsRepository.createFriendRequest(senderId, receiverId)
        return request
    },
    updateFriendRequestStatus: async(data)=> {
        const updatedRequest =await friendsRepository.updateFriendRequestStatus(data)
        return updatedRequest
    },

    deleteFriendRequest: async(requestId) => {
        const deletedRequest = await friendsRepository.deleteFriendRequest(requestId)
        return deletedRequest
    },
    recommendedPeople: async(userId, take) => {
        const recommendedPeople = await friendsRepository.recommendedPeople(userId, take)
        return recommendedPeople
    }
}