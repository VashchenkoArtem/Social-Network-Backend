import { compare } from "bcrypt";
import { client } from "../client/client";
import { IUserRepositoryContract } from "./user.types";


export const UserRepository: IUserRepositoryContract = {
    findUserByEmail: async (email: string) => {
        return await client.user.findUnique({
            where: { email }
        })
    },
    createUser: async (data) => {
        const dataWithoutCode = {...data, code: undefined}
        const user = await client.user.create({
            data: dataWithoutCode
        });
        return user
    },
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
};