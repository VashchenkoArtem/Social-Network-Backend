import { Router } from "express";
import { albumController } from "./album.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const albumRouter = Router();


albumRouter.get("/albums",  albumController.getAlbums);
albumRouter.post("/albums", authMiddleware,  albumController.createAlbum);
albumRouter.patch("/albums/:id",  albumController.updateAlbum);