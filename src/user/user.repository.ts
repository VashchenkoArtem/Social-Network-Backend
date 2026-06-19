import { compare } from "bcrypt";
import { client } from "../client/client";
import { IUserRepositoryContract } from "./user.types";
import { Album, Photo } from "../album/types/album.types";
import cloudinary from "../config/cloudinary";


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
        const { id, ...userData } = data;
        const user = await client.user_app_user.create({
            data: {
                ...userData,
                profile_app_profile: {
                    create: {
                        is_text_signature: false,
                        is_image_signature: true,
                        profile_app_album: {
                            create: [{
                                name: "Мої фото",
                                theme: "За замовчуванням",
                                year: new Date().getFullYear(),
                                is_shown: true,
                                is_default: true,
                                created_at: new Date(Date.now())
                            }]
                        }
                    }
                }
            },
            include: { profile_app_profile: true },
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
                where: { id: BigInt(id) },
                omit: { password: true },
                include: {
                    profile_app_profile: true
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
        let parsedBirthDate: Date | undefined = undefined;
        const birthDateData = data.birth_date;

        if (birthDateData && typeof birthDateData === 'string') {
            const parts = birthDateData.split('.');
            if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);
                
                const utcTimestamp = Date.UTC(year, month - 1, day);
                const date = new Date(utcTimestamp);

                if (!isNaN(date.getTime())) {
                    parsedBirthDate = date;
                }
            }
        } else if (birthDateData instanceof Date) {
            const date = new Date(Date.UTC(
                birthDateData.getFullYear(), 
                birthDateData.getMonth(), 
                birthDateData.getDate()
            ));
            parsedBirthDate = date;
        }

        const profileUpdate: any = {};
        if (data.signature !== undefined) profileUpdate.signature = data.signature;
        if (data.pseudonym !== undefined) profileUpdate.pseudonym = data.pseudonym;
        if (parsedBirthDate !== undefined) profileUpdate.birth_date = parsedBirthDate;
        if (filename !== undefined) profileUpdate.avatar = filename;

        return await client.user_app_user.update({
            where: { id: userId },

            data: {
                ...(data.first_name !== undefined && { first_name: data.first_name }),
                ...(data.last_name !== undefined && { last_name: data.last_name }),
                ...(data.username !== undefined && { username: data.username }),
                ...(data.email !== undefined && { email: data.email }),
                ...(data.password !== undefined && { password: data.password }),

                ...(Object.keys(profileUpdate).length > 0 && {
                    profile_app_profile: {
                        update: profileUpdate
                    }
                })
            },

            include: {
                profile_app_profile: true
            },

            omit: {
                password: true
            }
        });
    },
    findAlbumByName: async (userId, name): Promise<Album | null> => {
        const album = await client.profile_app_album.findFirst({
            where: {
                name: name,
                profile_app_profile: { profile_app_album: { some: {id: userId} } }
            },
            include: { profile_app_albumimage: true }
        });
        
        return album as Album | null;
    },

    addPhotoToAlbum: async (albumId, filename): Promise<Photo> => {
        return await client.profile_app_albumimage.create({
            data: {
                image: filename,
                album_id: albumId,
                is_shown: true,
                created_at: new Date(Date.now())
            }
        });
    },

    updateUserAvatar: async (userId, filename) => {
        return await client.profile_app_profile.update({
            where: { id: userId },
            data: { avatar: filename }
        });
    },

    findProfileByUserId: async (userId) => {
        return await client.profile_app_profile.findUnique({
            where: { id: userId }
        });
    },
    findUserById: async (userId) => {
        try {
            const user = await client.user_app_user.findUnique({
                where: { id: userId },
                omit: { password: true },
                include: { profile_app_profile: true }
            });
            if (!user) return "User was not found";
            return user;
        } catch (error) {
            throw new Error("Could not find user by id");
        }
    },
};
