import { Request, Response } from "express"
import {
    FriendRequest,
    FriendRequestResponse,
    UpdateFriendRequestDTO,
    UserWithProfile
} from "./friends.types"

export interface IFriendsControllerContract {
    getAllFriends: (
        req: Request<object, FriendRequestResponse[] | string, object>,
        res: Response<FriendRequestResponse[] | string>
    ) => void

    getAllRequests: (
        req: Request<object, FriendRequestResponse[] | string, object>,
        res: Response<FriendRequestResponse[] | string>
    ) => void

    createFriendRequest: (
        req: Request<object, FriendRequest | string, { receiverId: number }, object>,
        res: Response<FriendRequest | string>
    ) => void

    updateFriendRequestStatus: (
        req: Request<{ requestId: string }, FriendRequest | string, UpdateFriendRequestDTO, object>,
        res: Response<FriendRequest | string>
    ) => void

    deleteFriendRequest: (
        req: Request<{ requestId: string }, FriendRequest | string, object, object>,
        res: Response<FriendRequest | string>
    ) => void

    recommendedPeople: (
        req: Request<object, UserWithProfile[] | string, object, object>,
        res: Response<UserWithProfile[] | string>
    ) => void
}

export interface IFriendsServiceContract {
    getAllFriends: (userId: number) => Promise<FriendRequestResponse[]>
    getAllRequests: (userId: number) => Promise<FriendRequestResponse[]>
    createFriendRequest: (senderId: number, receiverId: number) => Promise<FriendRequest>
    updateFriendRequestStatus: (data: UpdateFriendRequestDTO) => Promise<FriendRequest>
    deleteFriendRequest: (requestId: number) => Promise<FriendRequest>
    recommendedPeople: (userId: number) => Promise<UserWithProfile[]>
}

export interface IFriendsRepositoryContract {
    getAllFriends: (userId: number) => Promise<FriendRequestResponse[]>
    getAllRequests: (userId: number) => Promise<FriendRequestResponse[]>
    createFriendRequest: (senderId: number, receiverId: number) => Promise<FriendRequest>
    updateFriendRequestStatus: (data: UpdateFriendRequestDTO) => Promise<FriendRequest>
    deleteFriendRequest: (requestId: number) => Promise<FriendRequest>
    recommendedPeople: (userId: number) => Promise<UserWithProfile[]>
}