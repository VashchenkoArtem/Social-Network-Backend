
import type { Prisma } from "../generated/prisma/client";
import type { Request, Response } from "express"

export interface User {
    id: number
    email: string
    password: string
}

export interface UserAuthResponse{
    token: string
}

export type CreateUser = Prisma.UserCreateInput

export interface IControllerContract {
    login: (
		req: Request<object, CreateUser | string, CreateUser, object>,
		res: Response<CreateUser | UserAuthResponse | string>,
	) => Promise<void>
}

export interface IServiceContract {
    login: (data: CreateUser) => Promise<UserAuthResponse | string>
}

export interface IRepositoryContract {
    login: (data: CreateUser) => Promise<User | string>
    findByEmail: (email: string) => Promise<User | string>

}