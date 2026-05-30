import { Prisma } from "@prisma/client"
import { User } from "../../User/types/user.types"

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