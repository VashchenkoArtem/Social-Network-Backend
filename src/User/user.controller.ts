import { Request, Response } from "express";
import { IUserControllerContract, CreateUser, VerifyPayload, AuthToken } from "./user.types";
import { UserService } from "./user.service";


export const userController: IUserControllerContract = {
    registration: async (
        req: Request<object, { message: string }, CreateUser>, 
        res: Response<{ message: string }>
    ): Promise<void> => {
        try {
            const response = await UserService.registration(req.body);
            res.status(200).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Registration failed";
            res.status(400).json({ message });
        }
    },

    verify: async (
        req: Request<object, AuthToken, VerifyPayload>, 
        res: Response<AuthToken | { message: string }>
    ): Promise<void> => {
        try {
            const response = await UserService.verifyCode(req.body);
            res.status(201).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Verification failed";
            res.status(400).json({ message });
        }
    }
};