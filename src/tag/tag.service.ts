import { ITagServiceContract } from "./tag.types";
import { TagRepository } from "./tag.repository";

export const TagService: ITagServiceContract = {
    getAll: async () => {
        try {
            return await TagRepository.findAll();
        } catch (error) {
            return error instanceof Error ? error.message : "Error fetching tags";
        }
    },
    create: async (name: string) => {
        try {
            return await TagRepository.create(name);
        } catch (error) {
            return error instanceof Error ? error.message : "Error creating tag";
        }
    }
};