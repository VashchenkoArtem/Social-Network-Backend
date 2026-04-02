import { compare } from "bcrypt";
import { client } from "../client/client";
import type { IRepositoryContract } from "./user.types";

export const UserRepository: IRepositoryContract = {
    login: async (data) => {
        const user = await client.user.findUnique({
            where: { email: data.email },
        })

        if (!user) {
            return "User doesn't exists. Tqry again, please"
        }
        
        const isPasswordCorrect = await compare(data.password, user.password);
        if (!isPasswordCorrect) {
            return "Password not correct. Try again, please"
        }
        
        return user
    },

    findByEmail: async (email) => {
        const user = await client.user.findUnique({
            where: { email: email },
        })
        
        if (!user) {
            return "User not found. Try again, please"
        }
        return user
    },
};