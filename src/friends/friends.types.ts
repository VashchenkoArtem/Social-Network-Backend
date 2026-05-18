import { Prisma } from "@prisma/client"
import type { Request, Response } from "express"

export type FriendRequest = Prisma.user_app_friendrequestGetPayload<{}>
export type UpdateFriendRequest = Prisma.user_app_friendrequestUncheckedUpdateInput
export type CreateFriendRequest = Prisma.user_app_friendrequestUncheckedCreateInput

export type UserWithProfile = Prisma.user_app_userGetPayload<{
    include: {
        profile: true
    }
}>
    
export interface IFriendsControllerContract {
    getAllFriends: (
        req: Request<object,  FriendRequest[] | string, object>,
        res: Response<FriendRequest[] | string>
    ) => void
    
    getAllRequests: (
        req: Request<object,  FriendRequest[] | string, object>,
        res: Response<FriendRequest[] | string>
    ) => void

    createFriendRequest: (
        req: Request<object, FriendRequest | string, {receiverId: number},object >,
        res: Response<FriendRequest | string>
    ) => void

    updateFriendRequestStatus: (
        req: Request<{requestId: string}, FriendRequest | string, UpdateFriendRequest & {requestId: number}, object>,
        res: Response<FriendRequest | string>
    ) => void

    deleteFriendRequest: (
        req: Request<{requestId: string}, FriendRequest | string, object, object>,
        res: Response<FriendRequest | string>
    ) => void,
    recommendedPeople: (
        req: Request<object, UserWithProfile[] | string, object, object>,
        res: Response<UserWithProfile[] | string>
    ) => void
}

export interface IFriendsServiceContract {
    getAllFriends: (userId: number) => Promise<FriendRequest[]>
    getAllRequests: (userId: number) => Promise<FriendRequest[]>
    createFriendRequest: (senderId: number, receiverId: number) => Promise<FriendRequest>
    updateFriendRequestStatus: (data: UpdateFriendRequest & {requestId: number}) => Promise<FriendRequest>
    deleteFriendRequest: (requestId: number) => Promise<FriendRequest>
    recommendedPeople: (userId: number) => Promise<UserWithProfile[]>
}


export interface IFriendsRepositoryContract {
    getAllFriends: (userId: number) => Promise<FriendRequest[]>
    createFriendRequest: (senderId: number, receiverId: number) => Promise<FriendRequest>
    getAllRequests: (userId: number) => Promise<FriendRequest[]>
    updateFriendRequestStatus: (data: UpdateFriendRequest & {requestId: number}) => Promise<FriendRequest>
    deleteFriendRequest: (requestId: number) => Promise<FriendRequest>
    recommendedPeople: (userId: number) => Promise<UserWithProfile[]>
}