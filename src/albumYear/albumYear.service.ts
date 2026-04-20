import { AlbumRepository } from "../album/album.repository";
import { AlbumYearRepository } from "./albumYear.repository";

export const AlbumYearService = {
    getYears: async () => {
        return await AlbumYearRepository.getYears();
    },
}