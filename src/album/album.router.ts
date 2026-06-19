import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { procImgMiddleware, uploadMiddleware } from "../middlewares/upload.middleware";
import { albumController } from "./album.controller";

export const albumRouter = Router()

albumRouter.post(
    "/upload/:albumId", 
    authMiddleware, 
    uploadMiddleware.array("images", 10), 
    procImgMiddleware(1200, 80, "profile_app", "albums"),
    albumController.uploadPhoto
)

albumRouter.patch("/albums/:id/visibility", authMiddleware, albumController.albumVisibility);
albumRouter.get("/albums/:userId", authMiddleware, albumController.getUserAlbums)
albumRouter.post("/albums", authMiddleware, albumController.createAlbum);
albumRouter.patch("/albums/:id", authMiddleware, albumController.updateAlbum); 
albumRouter.delete("/albums/:id", authMiddleware, albumController.deleteAlbum);
albumRouter.delete("/photo/:photoId", authMiddleware, albumController.deletePhoto);
albumRouter.patch("/photo/:photoId/visibility", authMiddleware, albumController.togglePhotoVisibility);