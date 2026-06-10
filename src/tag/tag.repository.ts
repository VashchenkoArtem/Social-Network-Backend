import { client } from "../client/client";
import { ITagRepositoryContract } from "./tag.types";

export const TagRepository: ITagRepositoryContract = {
    findAll: async () => {
        return await client.post_app_tag.findMany({ orderBy: { name: 'asc' } });
    },
    create: async (name: string) => {
        const existingTag = await client.post_app_tag.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } } // регистронезависимо
        });

        if (existingTag) {
            return existingTag;
        }

        return await client.post_app_tag.create({
            data: { name }
        });
    }
};