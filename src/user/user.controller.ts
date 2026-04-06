import { Request, Response } from "express";
import { IUserControllerContract, CreateUser, VerifyPayload, AuthToken } from "./user.types";
import { UserService } from "./user.service";


export const userController: IUserControllerContract = {
    registration: async (req, res) => {
        const body = req.body;
        const response = await UserService.registration(body);
        if (response instanceof Error) {
            res.status(400).json(response.message);
            return
        }
        res.status(200).json(response);
    },
    sendCode: async (req, res) => {
        const body = req.body;
        const response = await UserService.sendCode(body);
        res.status(200).json(response);
    },
    login: async (req, res) => {
        const data = req.body
        const authUser = await UserService.login(data)

        if (typeof authUser === "string"){
            res.status(400).json(authUser)
            return
        }
        res.status(200).json(authUser)
    },
    me: async(req, res) => {
        const userId = res.locals.userId
        const response = await UserService.me(userId)
        if (typeof response === "string"){
            res.status(400).json(response)
            return
        }
        res.status(200).json(response)
    },
    updateUser: async (req, res) => {
        const userId = res.locals.userId
        const updatedData = req.body
        const response = await UserService.updateUser(updatedData, userId)
        if (typeof response === "string"){
            res.status(400).json(response)
            return
        }
        res.status(200).json(response)
    },
};