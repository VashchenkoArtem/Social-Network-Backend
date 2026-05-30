import { Prisma } from "@prisma/client";

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
    firstname?: string;
    lastname?: string;
    username?: string;
    email?: string;
    password?: string
    signature?: string;
    pseudonym?: string;
    birth_date?: string | Date;
}

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

export type Message = {
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
}

export type CodeStore = Map<string, VerificationCode>

export type GetCodePayload = {
    email: string;
}