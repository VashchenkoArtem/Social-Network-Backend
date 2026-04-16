import { Prisma, Tag as PrismaTag } from "@prisma/client";
import { Request, Response } from "express";


export type Tag = PrismaTag;

export interface ITagControllerContract {
    getTags: (
        req: Request<object, Tag[] | string>,
        res: Response<Tag[] | string>
    ) => Promise<void>;
}

export interface ITagServiceContract {
    getAll: () => Promise<Tag[] | string>;
}

export interface ITagRepositoryContract {
    findAll: () => Promise<Tag[]>;
}