import { client } from "../client/client";
import { ITagRepositoryContract } from "./tag.types";

export const TagRepository: ITagRepositoryContract = {
    findAll: async () => {
        return await client.tag.findMany({ orderBy: { name: 'asc' } });
    },
    create: async (name: string) => {
        return await client.tag.upsert({
            where: { name } as any,
            update: {},
            create: { name }
        });
    }
};