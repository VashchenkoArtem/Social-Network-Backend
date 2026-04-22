import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { procImgMiddleware, uploadMiddleware } from "../middlewares/upload.middleware";
import { albumController } from "./album.controller";

export const albumRouter = Router()

albumRouter.post("/upload/:albumId", authMiddleware, uploadMiddleware.single("image"), procImgMiddleware(300, 100), albumController.uploadPhoto)
albumRouter.patch("/:id", authMiddleware, albumController.albumVisibility)
albumRouter.get("/albums", authMiddleware, albumController.getUserAlbums)
albumRouter.post("/albums", authMiddleware,  albumController.createAlbum);
albumRouter.patch("/albums/:id", authMiddleware,  albumController.updateAlbum); 
albumRouter.delete("/albums/:id", authMiddleware, albumController.deleteAlbum);
albumRouter.delete("/photo/:photoId", authMiddleware, albumController.deletePhoto);