import { Router } from "express";
import { tagController } from "./tag.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const tagRouter = Router();

tagRouter.get("/tags",  tagController.getTags);
tagRouter.post("/tags", authMiddleware, tagController.createTag);