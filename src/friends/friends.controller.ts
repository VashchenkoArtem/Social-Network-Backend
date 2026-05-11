import { create } from "node:domain";
import { friendsService } from "./friends.service";
import { IFriendsControllerContract } from "./friends.types";


export const friendController: IFriendsControllerContract = {
    getAllFriends: async (req, res) => {
        const userId = res.locals.userId;
        
        const friends = await friendsService.getAllFriends(userId);

        res.status(200).json(friends);
    },
    getAllRequests: async (req, res) => {
        const userId = res.locals.userId;
        
        const requests = await friendsService.getAllRequests(userId);

        res.status(200).json(requests);
    },
    createFriendRequest: async(req, res) => {
        const receiverId = res.locals.receiverId;

        const createdRequest = await friendsService.createFriendRequest(receiverId)
        
        res.status(200).json(createdRequest)
    },
    updateFriendRequestStatus: async (req, res)  => {
        const body = req.body

        const requestId = req.params.requestId
        
        const updatedRequest = await friendsService.updateFriendRequestStatus(requestId, body)
        return updatedRequest
    },
}