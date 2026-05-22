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
        const senderId = Number(res.locals.userId)
        const { receiverId } = req.body
        console.log(req.body)
        const createdRequest = await friendsService.createFriendRequest(senderId, receiverId)
        
        res.status(200).json(createdRequest)
    },
    updateFriendRequestStatus: async (req, res)  => {
        const body = req.body
        
        const updatedRequest = await friendsService.updateFriendRequestStatus(body)
        return updatedRequest
    },

    deleteFriendRequest: async (req, res) => {
        const requestId = Number(req.params.requestId)

        if (isNaN(requestId)) {
            res.status(400).json('Invalid Request ID')
            return
        }

        const deletedRequest = await friendsService.deleteFriendRequest(requestId)

        if (typeof deletedRequest === "string") {
            res.status(400).json(deletedRequest);
            return;
        }
        res.status(200).json('Request deleted successfully');
        return deletedRequest;
    },
    recommendedPeople: async (req, res) => {
        const userId = res.locals.userId
        const recommendedPeople = await friendsService.recommendedPeople(userId)
        res.status(200).json(recommendedPeople)
    }
}