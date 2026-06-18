import { Request, Response } from "express";
import { IUserControllerContract, CreateUser, VerifyPayload, AuthToken } from "./user.types";
import { UserService } from "./user.service";
import { AppError, BadRequestError } from "../errors";


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
        const { id, ...user } = response
        res.status(200).json({
            ...user,
            id: id.toString()
        });
    },
    updateUser: async (req, res) => {
        const userId = res.locals.userId
        const updatedData = req.body
        const files = req.files as Express.Multer.File[];
        const filename = files?.[0]?.filename;
        const response = await UserService.updateUser(updatedData, userId, filename)
        if (typeof response === "string"){
            res.status(400).json(response)
            return
        }
        res.status(200).json(response)
    },
    getCode: async (req, res) => {
        const { email } = req.body;

        if (!email) {
            res.status(400).json("Email and code are required");
            return;
        }

        const response = await UserService.getCode(email);

        if (typeof response === "string") {
            res.status(400).json(response);
            return;
        }

        res.status(200).json(response);
    },
    updatePassword: async (req, res) => {
        const userId = res.locals.userId
        const updatedPassword = req.body.password
        const response = await UserService.updatePassword(updatedPassword, userId)
        if (typeof response === "string"){
            res.status(500).json("Server error")
            return
        }
        res.status(200).json(response)
    },
    updateSignature: async (req, res) => {
        const userId = res.locals.userId
        const files = req.files as Express.Multer.File[];
        const filename = files?.[0]?.filename;
        if (!filename){
            throw BadRequestError
        }
        const response = await UserService.updateSignature(filename, userId)
        res.status(200).json(response)
    },
    getUserById: async (req, res) => {
        let id = 0n
        if (req.params.id){
            id = BigInt(req.params.id);
        }else{
            id = BigInt(res.locals.userId)
        }
        
        console.log(id)
        if (!id) {
            res.status(400).json("Invalid user id");
            return;
        }
    
        const response = await UserService.getUserById(id);
    
        if (typeof response === "string") {
            res.status(404).json(response);
            return;
        }
    
        res.status(200).json(response);
    },
    findUserById: async (req, res) => {
        const userId = BigInt(req.params.userId)
        const foundedUser = await UserService.findUserById(userId)
        if (!foundedUser){
            return res.status(404).json("User not found")
        }
        res.status(200).json(foundedUser)
    }
};