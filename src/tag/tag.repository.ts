import { client } from "../client/client";
import { ITagRepositoryContract } from "./tag.types";

export const TagRepository: ITagRepositoryContract = {
    findAll: async () => {
        try {
            return await client.tag.findMany({
                orderBy: { 
                    name: 'asc' 
                }
            });
        } catch (error) {
            throw new Error("Could not fetch tags from database");
        }
    }
};