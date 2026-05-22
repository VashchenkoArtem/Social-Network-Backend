import { compare } from "bcrypt";
import { client } from "../client/client";
import { IUserRepositoryContract } from "./user.types";
import { Album, Photo } from "../album/album.types";


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
        const { id, profileId, ...userData } = data;
        const user = await client.user_app_user.create({
            data: {
                ...userData,
                profile: {
                    create: {
                        albums: {
                            create: [{
                                name: "Мої фото",
                                theme: "За замовчуванням",
                                year: new Date().getFullYear(),
                                is_shown: true,
                                is_default: true
                            }]
                        }
                    }
                }
            },
            include: { profile: true },
            omit: { password: true }
        });
        return user || "User was not created";
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
    findAlbumByName: async (userId: number, name: string): Promise<Album | null> => {
        const album = await client.profile_app_album.findFirst({
            where: {
                name: name,
                profile: { user: { id: userId } }
            },
            include: { photos: true }
        });
        
        return album as Album | null;
    },

    addPhotoToAlbum: async (albumId: number, filename: string): Promise<Photo> => {
        return await client.profile_app_albumimage.create({
            data: {
                image: filename,
                albumId: albumId,
                is_shown: true
            }
        });
    },

    updateUserAvatar: async (userId: number, filename: string | null) => {
        return await client.profile_app_profile.update({
            where: { id: userId },
            data: { avatar: filename }
        });
    },

    findProfileByUserId: async (userId: number) => {
        return await client.profile_app_profile.findUnique({
            where: { id: userId }
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
};
