import { Prisma } from "@prisma/client"
import type { Request, Response } from "express"

export type FriendRequest = Prisma.user_app_friendrequestGetPayload<{}>
export type UpdateFriendRequest = Prisma.user_app_friendrequestUpdateInput
export type CreateFriendRequest = Prisma.user_app_friendrequestCreateInput
type FriendWithProfile =
    Prisma.user_app_friendrequestGetPayload<{
        include: {
            from_profile: {
                include: {
                    profile: true
                }
            }
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
        req: Request<object, FriendRequest | string, object, object>,
        res: Response<FriendRequest | string>
    ) => void

    updateFriendRequestStatus: (
        req: Request<{requestId: number}, FriendRequest | string, object, UpdateFriendRequest>,
        res: Response<string | FriendRequest>
    ) => void
}

export interface IFriendsServiceContract {
    getAllFriends: (userId: number) => Promise<FriendRequest[]>
    getAllRequests: (userId: number) => Promise<FriendRequest[]>
    createFriendRequest: (data: CreateFriendRequest) => Promise<FriendRequest>
    updateFriendRequestStatus: (requestId: number, data: UpdateFriendRequest) => Promise<FriendRequest>
}


export interface IFriendsRepositoryContract {
    getAllFriends: (userId: number) => Promise<FriendRequest[]>
    createFriendRequest: (data: CreateFriendRequest) => Promise<FriendRequest>
    getAllRequests: (userId: number) => Promise<FriendRequest[]>
    
    updateFriendRequestStatus: (requestId: number, data: UpdateFriendRequest) => Promise<FriendRequest>
}