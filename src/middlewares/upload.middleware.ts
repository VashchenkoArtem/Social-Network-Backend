import { ValidationError } from "../errors/app-errors";
import { join } from "node:path";
import multer, { memoryStorage } from "multer";
import sharp from "sharp";

import type { NextFunction, Request, Response } from "express";
import { originalDir, thumbDir } from "../config/path";


export const uploadMiddleware = multer({ storage: memoryStorage() })

export function procImgMiddleware(width: number, quality:number){
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file){
                next(new ValidationError("file validation error"))
                return
            }
            const fileName = `${Date.now()}.jpg`
            const filePathOriginal = join(originalDir, fileName);
            const filePathThumb = join(thumbDir, fileName);
            
            await sharp(req.file.buffer).flatten({ background: "#ffffff" }).toFile(filePathOriginal)
            await sharp(req.file.buffer).resize({width}).flatten({ background: "#ffffff" }).jpeg({quality}).toFile(filePathThumb)
            
            req.file.filename = fileName
            next()
        } catch (error) {
            next(error)
        }
        
    }
}