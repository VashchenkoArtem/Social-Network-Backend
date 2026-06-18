import multer, { memoryStorage } from "multer";
import sharp from "sharp";
import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import { UploadApiResponse } from "cloudinary";

export const uploadMiddleware = multer({ storage: memoryStorage() })


function uploadBuffer(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Cloudinary returned no result"));
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
}

interface CloudinaryFile extends Express.Multer.File {
    secure_url?: string;
}

export function procImgMiddleware(width: number, quality: number, folder?: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.files || !Array.isArray(req.files)) {
                return next();
            }

            const files = req.files as CloudinaryFile[];

            await Promise.all(
                files.map(async (file) => {
                    const originalBuffer = await sharp(file.buffer)
                        .resize({ width: width, withoutEnlargement: true })
                        .flatten({ background: "#ffffff" })
                        .jpeg({ quality })
                        .toBuffer();
                    const result = await uploadBuffer(originalBuffer, "folder");
                    file.filename = result.public_id;
                    file.secure_url = result.secure_url;
                })
            );
            
            next();
        } catch (error) {
            next(error);
        }
    };
}