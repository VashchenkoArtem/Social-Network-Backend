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
    },
    createTag: async (req, res) => {
        const { name } = req.body;
        const response = await TagService.create(name);
        res.status(typeof response === "string" ? 400 : 201).json(response);
    }
};