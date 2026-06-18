import { friendsService } from "./friends.service";
import { IFriendsControllerContract } from "./friends.types";

export const friendController: IFriendsControllerContract = {
    getAllFriends: async (req, res) => {
        try {
            const userId = res.locals.userId;
            const friends = await friendsService.getAllFriends(userId);
            res.status(200).json(friends);
        } catch (error) {
            console.log(error)
            res.status(500).json("Internal Server Error");
        }
    },

    getAllRequests: async (req, res) => {
        try {
            const limit = Number(req.query.limit)
            const cursor = Number(req.query.cursor)
            if (Number.isNaN(limit)) {
                res.status(400).json('Query param take must be a number')
                return
            }

            const userId = res.locals.userId;
            const requests = await friendsService.getAllRequests(userId, { limit, cursor });
            res.status(200).json(requests);
        } catch (error) {
            console.log(error)
            res.status(500).json("Internal Server Error");
        }
    },

    createFriendRequest: async(req, res) => {
        try {
            const senderId = Number(res.locals.userId);
            const { receiverId } = req.body;
            
            const createdRequest = await friendsService.createFriendRequest(senderId, receiverId);
            res.status(200).json(createdRequest);
        } catch (error) {
            res.status(500).json("Internal Server Error");
        }
    },

    updateFriendRequestStatus: async (req, res) => {
        try {
            const body = req.body;
            const updatedRequest = await friendsService.updateFriendRequestStatus(body);
            
            res.status(200).json(updatedRequest);
        } catch (error) {
            res.status(500).json("Internal Server Error");
        }
    },

    deleteFriendRequest: async (req, res) => {
        try {
            const requestId = Number(req.params.requestId);

            if (isNaN(requestId)) {
                res.status(400).json('Invalid Request ID');
                return;
            }

            const deletedRequest = await friendsService.deleteFriendRequest(requestId);

            if (typeof deletedRequest === "string") {
                res.status(400).json(deletedRequest);
                return;
            }
            
            res.status(200).json(deletedRequest);
        } catch (error) {
            res.status(500).json("Internal Server Error");
        }
    },

    recommendedPeople: async (req, res) => {
        try {
            const limit = Number(req.query.limit)
            const cursor = Number(req.query.cursor)
            if (Number.isNaN(limit)) {
                res.status(400).json('Query param take must be a number')
                return
            }
            const userId = res.locals.userId;
            const recommendedPeople = await friendsService.recommendedPeople(userId, {limit, cursor})
            res.status(200).json(recommendedPeople);
        } catch (error) {
            res.status(500).json("Internal Server Error");
        }
    }
}