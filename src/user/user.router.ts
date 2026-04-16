import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";


export const userRouter = Router();

userRouter.post("/registration", userController.registration);
userRouter.post("/send-code", userController.sendCode);
userRouter.post('/login', userController.login);
userRouter.get("/me", authMiddleware, userController.me);
userRouter.patch("/update-user", uploadMiddleware.single('file'), authMiddleware, userController.updateUser);
userRouter.post("/find-code", userController.getCode)
userRouter.patch("/update-password", authMiddleware, userController.updatePassword)