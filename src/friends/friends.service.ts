import { friendsRepository } from "./friends.repository";
import { IFriendsServiceContract } from "./types/friends.types";

export const friendsService : IFriendsServiceContract = {
    getAllFriends: async(userId) => {
        const friends = await friendsRepository.getAllFriends(userId)
        return friends
    },
    getAllRequests: async(userId) => {
        const requests = await friendsRepository.getAllRequests(userId)
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
    recommendedPeople: async(userId) => {
        const recommendedPeople = await friendsRepository.recommendedPeople(userId)
        return recommendedPeople
    }
}