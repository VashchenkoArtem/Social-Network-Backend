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
export type ErrorMessage = {
    message: string
}
export interface AuthToken {
    token: string;
    user: {
        id: number;
        nickname: string | null | undefined;
        email: string;
    };
}

export interface VerifyPayload {
    email: string;
    code: string;
    userData: CreateUser;
}
export interface IUserControllerContract {
    registration: (
        req: Request<object, CreateUser, RegistrationData>,
        res: Response<CreateUser>
    ) => void,
    sendCode: (
        req: Request<object, ErrorMessage, RegistrationData>,
        res: Response<ErrorMessage>
    ) => void
}
export interface IUserServiceContract {
    registration: (data: RegistrationData) => Promise<User>;
    sendCode: (data: CreateUser) => Promise<ErrorMessage>;
}
export interface IUserRepositoryContract {
    findUserByEmail: (email: string) => Promise<User | null>;
    createUser: (data: CreateUser) => Promise<User>;
}



