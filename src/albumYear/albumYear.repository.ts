import { client } from "../client/client";

export const AlbumYearRepository = {
    getYears: async () => {
        return await client.albumYear.findMany({
            orderBy: {
                year: "desc"
            }
        });
    },
}