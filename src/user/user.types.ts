import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export type User = Prisma.UserGetPayload<{}>
export type CreateUser = Prisma.UserUncheckedCreateInput

export type AuthenticatedUser = {
    id: number
}
export type RegistrationData = {
    code: string,
    email: string,
    password: string
}
export type  Message = {
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
}
export interface IUserServiceContract {
    registration: (data: RegistrationData) => Promise<AuthToken>;
    sendCode: (data: CreateUser) => Promise<Message>;
    login: (data: CreateUser) => Promise<{token: string} | string>
}
export interface IUserRepositoryContract {
    login: (data: CreateUser) => Promise<User | string>
    findUserByEmail: (email: string) => Promise<User | null>;
    createUser: (data: CreateUser) => Promise<User>;
}