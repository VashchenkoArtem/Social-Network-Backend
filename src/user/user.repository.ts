import { compare } from "bcrypt";
import { client } from "../client/client";
import { IUserRepositoryContract } from "./user.types";


export const UserRepository: IUserRepositoryContract = {
    findUserByEmail: async (email: string) => {
        try {
            const user = await client.user_app_user.findUnique({
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
            const { id, profileId, ...userData } = data;

            const user = await client.user_app_user.create({
                data: {
                    ...userData,

                    profile: {
                        create: {}
                    }
                },

                include: {
                    profile: true
                },

                omit: {
                    password: true
                }
            });

            if (!user) {
                return "User was not created";
            }

            return user;

        } catch (error) {
            throw error;
        }
    },
    login: async (data) => {
        try {
            const user = await client.user_app_user.findUnique({
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
            const user = await client.user_app_user.findUnique({
                where: { id: id },
                omit: { password: true },
                include: {
                    profile: true
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
        return await client.user_app_user.update({
            where: { id: userId },

            data: {
                ...(data.firstname !== undefined && {
                    firstname: data.firstname
                }),

                ...(data.lastname !== undefined && {
                    lastname: data.lastname
                }),

                ...(data.username !== undefined && {
                    username: data.username
                }),

                ...(data.email !== undefined && {
                    email: data.email
                }),

                profile: {
                    update: {
                        ...(data.signature !== undefined && {
                            signature: data.signature
                        }),

                        ...(data.pseudonym !== undefined && {
                            pseudonym: data.pseudonym
                        }),

                        ...(data.birth_date !== undefined && {
                            birth_date: data.birth_date
                        }),

                        ...(filename && {
                            avatar: filename
                        })
                    }
                }
            },

            include: {
                profile: true
            },

            omit: {
                password: true
            }
        });
    },
    findUserById: async (userId) => {
        try {
            const user = await client.user_app_user.findUnique({
                where: { id: userId },
                omit: { password: true },
                include: { profile: true }
            });
            if (!user) return "User was not found";
            return user;
        } catch (error) {
            throw new Error("Could not find user by id");
        }
    },

}
