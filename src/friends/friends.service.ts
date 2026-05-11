import { friendsRepository } from "./friends.repository";
import { IFriendsServiceContract } from "./friends.types";

export const friendsService : IFriendsServiceContract = {
    getAllFriends: async(userId) => {
        const friends = await friendsRepository.getAllFriends(userId)
        return friends
    },
    getAllRequests: async(userId) => {
        const requests = await friendsRepository.getAllRequests(userId)
        return requests
    },
    createFriendRequest: async(receiverId) => {
        const request = await friendsRepository.createFriendRequest(receiverId)
        return request
    },
    updateFriendRequestStatus(request, data) {
        const updatedRequest = friendsRepository.updateFriendRequestStatus(request, data)
        return updatedRequest
    },
}