import { ValidationError } from "../errors/app-errors";
import { join } from "node:path";
import multer, { memoryStorage } from "multer";
import sharp from "sharp";

import type { NextFunction, Request, Response } from "express";
import { originalDir, thumbDir } from "../config/path";


export const uploadMiddleware = multer({ storage: memoryStorage() })

export function procImgMiddleware(width: number, quality: number) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.files || !Array.isArray(req.files)) {
                return next();
            }

            const processedFiles = [];

            for (const file of req.files) {
                const fileName = `${Date.now()}.jpg`;

                const filePathOriginal = join(originalDir, fileName);
                const filePathThumb = join(thumbDir, fileName);

                await sharp(file.buffer)
                    .flatten({ background: "#ffffff" })
                    .jpeg({ quality })
                    .toFile(filePathOriginal);

                await sharp(file.buffer)
                    .resize({ width })
                    .flatten({ background: "#ffffff" })
                    .jpeg({ quality })
                    .toFile(filePathThumb);

                file.filename = fileName;

                processedFiles.push({
                    filename: fileName,
                    original: filePathOriginal,
                    thumb: filePathThumb
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}