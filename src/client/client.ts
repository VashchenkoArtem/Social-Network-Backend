import { PrismaClient } from "@prisma/client";
import { paginate } from "prisma-extension-pagination";

export const client = new PrismaClient().$extends({
    model: {
        post_app_post: {
            paginate
        },
        chat_app_message: {
            paginate
        },
        user_app_user: {
            paginate
        }
    }
})
