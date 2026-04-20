import type { Request, Response } from "express";
import { AlbumYearService } from "./albumYear.service";

export const AlbumYearController = {
    getYears: async (req: Request,res: Response): Promise<void> => {
    try {
        const years = await AlbumYearService.getYears();
        res.status(200).json(years);
    } catch (e) {
        res.status(500).json((e as Error).message);
    }
    },
}