import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { procImgMiddleware, uploadMiddleware } from "../middlewares/upload.middleware";


export const userRouter = Router();

userRouter.post("/registration", userController.registration);
userRouter.post("/send-code", userController.sendCode);
userRouter.post('/login', userController.login);
userRouter.get("/me", authMiddleware, userController.me);
userRouter.patch("/update-user", authMiddleware, uploadMiddleware.single("file"), procImgMiddleware(300, 100), userController.updateUser);
userRouter.post("/find-code", userController.getCode)
userRouter.patch("/update-password", authMiddleware, userController.updatePassword)
userRouter.patch("/signature", authMiddleware, uploadMiddleware.single("file"), procImgMiddleware(300, 100), userController.updateSignature)