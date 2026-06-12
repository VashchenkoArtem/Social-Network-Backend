import { Prisma } from "@prisma/client"
import type { Request, Response } from "express"
import { User } from "../user/user.types"

export type FriendRequest = Prisma.user_app_friendshipGetPayload<{}>
export type CreateFriendRequest = Prisma.user_app_friendshipUncheckedCreateInput
export type UpdateFriendRequestDTO = {
    status: string;
    requestId: number
}
export type FriendRequestResponse = {
    id: number;
    user: User
}
export type UserWithProfile = Prisma.user_app_userGetPayload<{
    include: {
        profile_app_profile: true
    }
}>

export interface PaginationDTO {
    limit?: number;
    cursor?: number;
}

export interface PaginatedRecsResponse {
    data: UserWithProfile[];
    meta: {
        nextCursor: number | null;
        hasMore: boolean;
    };
}

export interface PaginationQuery {
    limit?: string;
    cursor?: string;
}

export interface PaginatedFriendRequestResponse {
    data: FriendRequestResponse[];
    meta: {
        nextCursor: number | null;
        hasMore: boolean;
    };
}
    
export interface IFriendsControllerContract {
    getAllFriends: (
        req: Request<object,  FriendRequestResponse[] | string, object>,
        res: Response<FriendRequestResponse[] | string>
    ) => void
    
    getAllRequests: (
        req: Request<object,  PaginatedFriendRequestResponse | string, object, PaginationQuery>,
        res: Response<PaginatedFriendRequestResponse | string>
    ) => void

    createFriendRequest: (
        req: Request<object, FriendRequest | string, {receiverId: number},object >,
        res: Response<FriendRequest | string>
    ) => void

    updateFriendRequestStatus: (
        req: Request<{requestId: string}, FriendRequest | string, UpdateFriendRequestDTO, object>,
        res: Response<FriendRequest | string>
    ) => void

    deleteFriendRequest: (
        req: Request<{requestId: string}, FriendRequest | string, object, object>,
        res: Response<FriendRequest | string>
    ) => void,

    recommendedPeople: (
        req: Request<object, PaginatedRecsResponse | string, object, PaginationQuery>,
        res: Response<PaginatedRecsResponse | string>
    ) => void
}

export interface IFriendsServiceContract {
    getAllFriends: (userId: number) => Promise<FriendRequestResponse[]>
    getAllRequests: (userId: number, paginationData: PaginationDTO) => Promise<PaginatedFriendRequestResponse>
    createFriendRequest: (senderId: number, receiverId: number) => Promise<FriendRequest>
    updateFriendRequestStatus: (data: UpdateFriendRequestDTO) => Promise<FriendRequest>
    deleteFriendRequest: (requestId: number) => Promise<FriendRequest>
    recommendedPeople: (userId: number, paginationData: PaginationDTO) => Promise<PaginatedRecsResponse>
}


export interface IFriendsRepositoryContract {
    getAllFriends: (userId: number) => Promise<FriendRequestResponse[]>
    createFriendRequest: (senderId: number, receiverId: number) => Promise<FriendRequest>
    getAllRequests: (userId: number, paginationData: PaginationDTO) => Promise<PaginatedFriendRequestResponse>
    updateFriendRequestStatus: (data: UpdateFriendRequestDTO) => Promise<FriendRequest>
    deleteFriendRequest: (requestId: number) => Promise<FriendRequest>
    recommendedPeople: (userId: number, paginationData: PaginationDTO) => Promise<PaginatedRecsResponse>
}