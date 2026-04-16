import { ITagServiceContract } from "./tag.types";
import { TagRepository } from "./tag.repository";

export const TagService: ITagServiceContract = {
    getAll: async () => {
        try {
            return await TagRepository.findAll();
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
            return "Unknown error occurred while fetching tags";
        }
    }
};