import { compare } from "bcrypt";
import { client } from "../client/client";
import { IUserRepositoryContract } from "./user.types";


export const UserRepository: IUserRepositoryContract = {
    findUserByEmail: async (email: string) => {
        try {
            const user = await client.user.findUnique({
                where: { email },
            });
            return user;
        } catch (error) {
            console.log(error)
            throw new Error("Could not find user by email");
        }
        
    },
    createUser: async (data) => {
        try {
            const user = await client.user.create({
                data: data,
                omit: { password: true }
            });
            if (!user) {
                return "User was not created"
            }
            return user;
        } catch (error) {
            throw error
        }
    },
    login: async (data) => {
        try {
            const user = await client.user.findUnique({
                where: { email: data.email },
            });
            if (!user) {
                return "User was not found"
            }
            const isPasswordValid = await compare(data.password, user.password);
            if (!isPasswordValid) {
                return "Invalid password"
            }
            return user;
        } catch (error) {
            throw new Error("Could not login user");
        }

    },
    me: async (id) => {
        try {
            const user = await client.user.findUnique({
                where: { id: id },
                omit: { password: true },
                include: {
                    avatars: true
                }
            })
            if (!user) {
                return "User was not found"
            }
            return user
        } catch (error) {
            throw new Error("Could not get user");
        }
    },
    updateUser: async (data, userId, filename) => {
        try {
            const { ...userData } = data;
            if (typeof data.birthDate === "string") {
                data.birthDate = new Date(data.birthDate);
            }
            const user = await client.user.update({
            where: { id: userId },
            data: userData,
            omit: { password: true }
            });

            if (filename) {
            await client.photo.create({
            data: {
                filename,
                avatarForId: userId
            }
            });
            }

            return user;
        } catch (error) {
            throw error;
        }
    }
};