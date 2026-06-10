import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { Album, Photo } from "../album/types/album.types";
import { AuthenticatedSocket, DataSocket, ServerSocket } from "../socket/socket.types";
export interface UserPayload {
    userIds: number[]
}
export type User = Prisma.user_app_userGetPayload<{}>
export type UserWithoutPasswordDTO = {
    id: string;
    last_login: Date | null;
    is_superuser: boolean;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: Date;
    username: string | null;
    email: string;
}
export type UserWithoutPassword = Omit<User, "password">
export type CreateUser = Prisma.user_app_userUncheckedCreateInput
export type UpdateUser = {
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    password?: string
    signature?: string;
    pseudonym?: string;
    birth_date?: string | Date;
    is_active?: boolean
};
export type UserCallback = (response: {
    onlineUserIds: number[]
} | {
    status: "error";
    message?: string;
}) => void;
export type UserWithProfile = Prisma.user_app_userGetPayload<{
    include: {
        profile_app_profile: true
    },
    omit: {
        password: true
    }
}>
export type AuthenticatedUser = {
    id: number
}
export type RegistrationData = {
    code: string,
    email: string,
    password: string,
    message: string
}
export type  Message = {
    message: string
}
export type ISendCode = {
    message: string
}
export interface AuthToken {
    token: string;
}

export interface VerifyPayload {
    email: string;
    code: string;
    userData: CreateUser;
}
export type VerificationCode = {
    email: string;
    code: string;
    expiresAt: number;
};
export type CodeStore = Map<string, VerificationCode>;
export type GetCodePayload = {
    email: string;
};
export interface IUserControllerContract {
    registration: (
        req: Request<object, AuthToken | string, RegistrationData>,
        res: Response<AuthToken | string>
    ) => void,
    sendCode: (
        req: Request<object, Message, RegistrationData>,
        res: Response<Message>
    ) => void,
    login: (
		req: Request<object, {token: string} | string, CreateUser, object>,
		res: Response<{token: string} | string>,
	) => Promise<void>
    me: (
        req: Request<object, UserWithoutPasswordDTO | string, object, object, {userId: number}>, 
        res: Response<UserWithoutPasswordDTO | string>
    ) => Promise<void>
    updateUser: (
        req: Request<object, UserWithoutPassword | string, UpdateUser, object>,
        res: Response<UserWithoutPassword | string>
    ) => Promise<void>
    getCode: (
        req: Request<object, VerificationCode | string, GetCodePayload>,
        res: Response<VerificationCode | string>
    ) => Promise<void>
    updatePassword: (
        req: Request<object, UserWithoutPassword | string, {password: string}, object>,
        res: Response<UserWithoutPassword | string>
    ) => Promise<void>
    updateSignature: (
        req: Request<object, UserWithoutPassword | string, UpdateUser, object>,
        res: Response<UserWithoutPassword | string>
    ) => void
    getUserById: (
        req: Request<{ id: string }, UserWithoutPassword | string>,
        res: Response<UserWithoutPassword | string>
    ) => Promise<void>;

    findUserById: (
        req: Request<{userId: string}, UserWithProfile | string, object>,
        res: Response<UserWithProfile | string>
    ) => void
}
export interface IUserServiceContract {
    registration: (data: RegistrationData) => Promise<AuthToken>;
    sendCode: (data: RegistrationData) => Promise<Message>;
    login: (data: CreateUser) => Promise<{token: string} | string>;
    me: (id: number) => Promise<UserWithoutPassword | string>;
    updateUser: (data: UpdateUser, userId: bigint, filename?: string) => Promise<UserWithoutPassword | string>;
    getCode: (email: string) => Promise<VerificationCode | string>;
    updatePassword: (password: string, userId: bigint) => Promise<UserWithoutPassword | string>
    updateSignature: (filename: string, userId: bigint) => Promise<UserWithoutPassword | string>
    // findAlbumByName: (userId: bigint, name: string) => Promise<Album | null>;
    // addPhotoToAlbum: (albumId: bigint, filename: string) => Promise<Photo>;
    getUserById: (id: bigint) => Promise<UserWithoutPassword | string>;
    findUserById: (userId: bigint) => Promise<UserWithProfile | string>
    // updateLastSeenAt: (userId: bigint) => Promise<UserWithProfile | string>
}
export interface IUserRepositoryContract {
    login: (data: CreateUser) => Promise<User | string>
    findUserByEmail: (email: string) => Promise<User | null>;
    createUser: (data: CreateUser) => Promise<UserWithoutPassword | string>;
    me: (id: number) => Promise<UserWithoutPassword | string>;
    updateUser: (data: UpdateUser, userId: bigint, filename?: string) => Promise<UserWithoutPassword | string>;
    findAlbumByName: (userId: bigint, name: string) => Promise<Album | null>;
    addPhotoToAlbum: (albumId: bigint, filename: string) => Promise<Photo>;
    updateUserAvatar: (userId: bigint, filename: string | null) => Promise<Prisma.profile_app_profileGetPayload<{}>>;
    findProfileByUserId: (userId: bigint) => Promise<Prisma.profile_app_profileGetPayload<{}> | null>;
    findUserById: (userId: bigint) => Promise<UserWithProfile | string>
    // updateLastSeenAt: (userId: bigint) => Promise<UserWithProfile | string>
}

export interface UserSocketControllerContract {
    registerHandlers: (socket: AuthenticatedSocket, socketServer: ServerSocket | null) => void;
    isUserOnline: (userId: number, socketServer: ServerSocket) => Promise<boolean>;
    getUsersOnline: (socketServer: ServerSocket, data: UserPayload, ack?: UserCallback) => void
}