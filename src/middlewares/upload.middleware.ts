import multer, { memoryStorage } from "multer";
import sharp from "sharp";
import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import { UploadApiResponse } from "cloudinary";

export const uploadMiddleware = multer({ storage: memoryStorage() })
function uploadBuffer(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (!result) {
                    return reject(new Error("Cloudinary returned no result"));
                }

                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
}
export function procImgMiddleware(width: number, quality: number) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.files || !Array.isArray(req.files)) {
                return next();
            }

            await Promise.all(
                req.files.map(async (file) => {
                    const originalBuffer = await sharp(file.buffer)
                        .flatten({ background: "#ffffff" })
                        .jpeg({ quality })
                        .toBuffer();

                    const result = await uploadBuffer(originalBuffer);

                    file.filename = result.public_id;

                    return {
                        publicId: result.public_id,
                        url: result.secure_url
                    };
                })
            )
            next();
        } catch (error) {
            next(error);
        }
    };
}