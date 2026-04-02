import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.registration);
router.post("/verify", userController.verify);

export default router;