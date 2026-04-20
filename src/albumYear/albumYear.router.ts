import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { albumController } from "../album/album.controller";
import { AlbumYearController } from "./albumYear.controller";

export const albumYearRouter = Router()

albumYearRouter.get("/years", authMiddleware, AlbumYearController.getYears);