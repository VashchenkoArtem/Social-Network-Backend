import { Router } from "express";
import { userController } from "./user.controller";

export const userRouter = Router();

userRouter.post("/registration", userController.registration);
userRouter.post("/send-code", userController.sendCode);