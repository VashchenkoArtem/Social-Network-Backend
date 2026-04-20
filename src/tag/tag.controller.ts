import { ITagControllerContract } from "./tag.types";
import { TagService } from "./tag.service";

export const tagController: ITagControllerContract = {
    getTags: async (req, res) => {
        const response = await TagService.getAll();
        
        if (typeof response === "string") {
            res.status(400).json(response);
            return;
        }
        res.status(200).json(response);
    }
};