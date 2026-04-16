import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { albumController } from "./album.controller";

export const albumRouter = Router()

albumRouter.post("/upload", authMiddleware, uploadMiddleware.single("image"), albumController.uploadPhoto)
albumRouter.patch("/:id", authMiddleware, albumController.albumVisibility)
albumRouter.get("/albums", authMiddleware, albumController.getUserAlbums)