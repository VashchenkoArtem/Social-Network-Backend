import { Request, Response } from "express";
import { AlbumService } from "./album.service";
import { IAlbumControllerContract } from "./album.types";

export const albumController: IAlbumControllerContract = {
    uploadPhoto: async (req, res) => {
        try {
            const albumId = req.params.albumId
            const file = req.file
            if (!file) {
                res.status(400).json("Файл є обов'язковим")
                return
            }
            const result = await AlbumService.uploadPhoto(file, Number(albumId))
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json((error as Error).message)
        }
    },

    albumVisibility: async (req, res) => {
        try {
            const userId = res.locals.userId
            const albumId = Number(req.params.id)

            const result = await AlbumService.albumVisibility(albumId, userId)
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json((error as Error).message)
        }
    },

    getUserAlbums: async (req, res) => {
        try {
            const userId = res.locals.userId
            const albums = await AlbumService.getUserAlbums(userId)
            res.status(200).json(albums)
        } catch (error) {
            res.status(400).json((error as Error).message)
        }
    }
}