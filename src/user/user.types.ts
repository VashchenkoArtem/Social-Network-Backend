import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export type User = Prisma.UserGetPayload<{}>
export type UserWithoutPassword = Omit<User, "password">
export type CreateUser = Prisma.UserUncheckedCreateInput
export type UpdateUser = Prisma.UserUncheckedUpdateInput

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
        req: Request<object, UserWithoutPassword | string, object, object, {userId: number}>, 
        res: Response<UserWithoutPassword | string>
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
}
export interface IUserServiceContract {
    registration: (data: RegistrationData) => Promise<AuthToken>;
    sendCode: (data: RegistrationData) => Promise<Message>;
    login: (data: CreateUser) => Promise<{token: string} | string>;
    me: (id: number) => Promise<UserWithoutPassword | string>;
    updateUser: (data: UpdateUser, userId: number, filename?: string) => Promise<UserWithoutPassword | string>;
    getCode: (email: string) => Promise<VerificationCode | string>;
    updatePassword: (password: string, userId: number) => Promise<UserWithoutPassword | string>
}
export interface IUserRepositoryContract {
    login: (data: CreateUser) => Promise<User | string>
    findUserByEmail: (email: string) => Promise<User | null>;
    createUser: (data: CreateUser) => Promise<UserWithoutPassword | string>;
    me: (id: number) => Promise<UserWithoutPassword | string>;
    updateUser: (data: UpdateUser, userId: number, filename?: string) => Promise<UserWithoutPassword | string>;
}