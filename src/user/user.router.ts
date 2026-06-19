import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { procImgMiddleware, uploadMiddleware } from "../middlewares/upload.middleware";

export const userRouter = Router();

userRouter.post("/registration", userController.registration);
userRouter.post("/send-code", userController.sendCode);
userRouter.post('/login', userController.login);
userRouter.get("/me", authMiddleware, userController.me);

userRouter.patch(
    "/update-user", 
    authMiddleware, 
    uploadMiddleware.array("avatars", 1), 
    procImgMiddleware(400, 85, "profile_app", "avatars"),
    userController.updateUser
);

userRouter.post("/find-code", userController.getCode)
userRouter.patch("/update-password", authMiddleware, userController.updatePassword)

userRouter.patch(
    "/signature", 
    authMiddleware, 
    uploadMiddleware.array("signature", 1), 
    procImgMiddleware(500, 90, "profile_app", "signatures"),
    userController.updateSignature
)

userRouter.get("/users/:userId", authMiddleware, userController.findUserById)