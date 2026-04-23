import { Request, Response } from "express";
import { AlbumService } from "./album.service";
import { IAlbumControllerContract } from "./album.types";
import { AppError, AuthenticationError } from "../errors";

export const albumController: IAlbumControllerContract = {
    createAlbum: async (req, res) => {
        try {
            const userId = res.locals.userId
            const album = await AlbumService.createAlbum(req.body, userId);
            if (typeof album === "string"){
                res.status(401).json({message: "Error"})
                return
            }
            res.status(201).json(album);
        } catch (error: unknown) {
            console.log(error)
        }
    },
    uploadPhoto: async (req, res) => {
        try {
            const albumId = req.params.albumId
            const userId = res.locals.userId
            const file = req.file
            if (!file) {
                res.status(400).json("Файл є обов'язковим")
                return
            }
            const result = await AlbumService.uploadPhoto(file, Number(albumId), userId)
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
            const userId = res.locals.userId
            const albums = await AlbumService.getUserAlbums(userId)
            res.status(200).json(albums)
            
    },
    updateAlbum: async (req, res) => {
        try {
            const id = parseInt(String(req.params.id), 10);

            if (isNaN(id)) {
                throw new AppError("ID альбому має бути числом", 400);
            }
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new AppError("Відсутні дані для оновлення", 400);
            }
            const album = await AlbumService.updateAlbum(id, req.body);
            res.status(200).json(album);
        } catch (error: unknown) {
            console.log(error)
        }
    },
    deleteAlbum: async (req, res) => {
        try {
            const albumId = Number(req.params.id);
            if (isNaN(albumId)) {
                res.status(400).json("Некоректний ID альбому");
                return;
            }
            const album = await AlbumService.deleteAlbum(albumId);
            res.status(200).json(album);
        } catch (error) {
            res.status(400).json((error as Error).message);
        }
    },
    deletePhoto: async (req, res) => {
        try {
            const photoId = Number(req.params.photoId);
            if (isNaN(photoId)) {
                res.status(400).json("Некоректний ID фото");
                return;
            }

            const result = await AlbumService.deletePhoto(photoId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json((error as Error).message);
        }
    },

    togglePhotoVisibility: async (req, res) => {
        try {
            const photoId = Number(req.params.photoId)
            const result = await AlbumService.togglePhotoVisibility(photoId)
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json((error as Error).message)
        }
    },
};