import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/registration", userController.registration);
router.post("/send-code", userController.sendCode);

export default router;