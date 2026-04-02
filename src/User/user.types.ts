import { Request, Response } from "express";

export interface CreateUser {
    firstname?: string | null;
    lastname?: string | null;
    nickname?: string | null;
    email: string;
    password: string;
    birthDate?: Date | string | null;
    avatar?: string | null;
    signature?: string | null;
}

export type User = {
    id: number;
    firstname: string | null | undefined;
    lastname: string | null | undefined;
    nickname: string | null | undefined;
    email: string;
    password?: string;
    avatar: string | null | undefined;
    signature: string | null | undefined;
    birthDate: Date | null | undefined;
};

export type AuthenticatedUser = {
    id: number
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

export interface IUserRepositoryContract {
    createUser: (data: CreateUser) => Promise<User>;
    updateNickname: (id: number, nickname: string) => Promise<User>;
    upsertOtp: (email: string, code: string) => Promise<void>;
    getOtpByEmail: (email: string) => Promise<{ code: string } | null>;
    deleteOtp: (email: string) => Promise<void>;
}

export interface IUserServiceContract {
    registration: (data: CreateUser) => Promise<{ message: string }>;
    verifyCode: (payload: VerifyPayload) => Promise<AuthToken>;
}

export interface IUserControllerContract {
    registration: (
        req: Request<object, { message: string } | { message: string }, CreateUser>, 
        res: Response<{ message: string } | { message: string }>
    ) => Promise<void>;
    verify: (
        req: Request<object, AuthToken | { message: string }, VerifyPayload>, 
        res: Response<AuthToken | { message: string }>
    ) => Promise<void>;
}