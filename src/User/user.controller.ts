import { Request, Response } from "express";
import { IUserControllerContract, CreateUser, VerifyPayload, AuthToken } from "./user.types";
import { UserService } from "./user.service";


export const userController: IUserControllerContract = {
    registration: async (req, res) => {
        const body = req.body;
        const response = await UserService.registration(body);
        res.status(400).json(response);
    },
    sendCode: async (req, res) => {
        const body = req.body;
        const response = await UserService.sendCode(body);
        res.status(200).json(response);
    }
};