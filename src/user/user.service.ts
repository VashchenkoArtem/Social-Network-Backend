import bcrypt, { compare } from "bcrypt";
import jwt, { sign } from "jsonwebtoken";
import nodemailer from "nodemailer";
import { IUserServiceContract, AuthToken, CreateUser, VerifyPayload } from "./user.types";
import { cleanEnv, str } from "envalid";
import { UserRepository } from "./user.repository";
import { Album, Photo } from "../album/types/album.types";



type VerificationRecord = {
    code: string;
    expiresAt: number;
};
const verificationCodes = new Map<string, string>();
const ENV = cleanEnv(process.env, {
    MAIL_USER: str(),
    MAIL_PASS: str(),
    JWT_SECRET: str()
})


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENV.MAIL_USER,
        pass: ENV.MAIL_PASS
    }
});

export const UserService: IUserServiceContract = {
    sendCode: async (data) => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        verificationCodes.set(data.email, code);
        console.log(verificationCodes);
        await transporter.sendMail({
            from: 'mobileteamsocial@gmail.com',
            to: data.email,
            subject: data.message,
            html: `<h1>Ваш код: ${code}</h1>`
        });

        return { message: "Verification code sent to email" };
    },
    registration: async (data) => {
        const savedCode = verificationCodes.get(data.email);

        if (!savedCode || savedCode !== data.code) {
            throw new Error("Invalid or expired verification code");
        }

        verificationCodes.delete(data.email);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const foundedUser = await UserRepository.findUserByEmail(data.email);

        if (foundedUser) {
            throw new Error("User already exists");
        }
        const dataWithoutCode = { ...data, code: undefined };
        const createdUser = await UserRepository.createUser({ 
            ...dataWithoutCode, 
            password: hashedPassword,
            is_superuser: false,
            is_active: true,
            is_staff: false,
            first_name: "",
            last_name: "",
            date_joined: new Date(Date.now())
            
        });
        if (typeof createdUser === "string") {
            throw new Error("User was not created");
        }
        const token = sign(
            { id: Number(createdUser.id.toString()) },
            ENV.JWT_SECRET,
            { expiresIn: '7d' }
        );
        return { token };
    },
    login: async (data) => {
        const user = await UserRepository.findUserByEmail(data.email);

        if (!user) {
            return 'User was not found. Try again, please';
        }

        if (typeof user === "string") {
            return user;
        }

        const userConfirmation = await compare(data.password, user.password);
        if (!userConfirmation) {
            return 'You entered wrong credentionals. Try again, please';
        }

        const token = sign(
            { id: Number(user.id.toString()) },
            ENV.JWT_SECRET,
            { expiresIn: '7d' }
        );
        return { token };
    },
    me: async (id) => {
        const user = await UserRepository.me(id);

        if (typeof user === "string") {
            return user;
        }
        return user;
    },
    updateUser: async (data, userId, filename) => {
        const result = await UserRepository.updateUser(data, userId, filename);

        if (typeof result === "string") return result;
        if (filename) {
            try {
                const album = await UserRepository.findAlbumByName(userId, "Аватарки") 
                            || await UserRepository.findAlbumByName(userId, "Мої фото");
                
                if (album) {
                    await UserRepository.addPhotoToAlbum(album.id, filename);
                }
            } catch (error) {
                console.error("Синхронізація не вдалася, але дані профілю збережені");
            }
        }

        return result;
    },
    getCode: async (email: string) => {
        const record = verificationCodes.get(email);

        if (!record) {
            return "Code not found";
        }
        return record;
    },
    // findAlbumByName: function (userId: number, name: string): Promise<Album | null> {
    //     throw new Error("Function not implemented.");
    // },
    // addPhotoToAlbum: function (albumId: number, filename: string): Promise<Photo> {
    //     throw new Error("Function not implemented.");
    // },
    
    getUserById: async (id) => {
        return await UserRepository.findUserById(id);
    },
    updatePassword: async (password, userId) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = await UserRepository.updateUser({ password: hashedPassword }, userId);
        return userData;
    },
    updateSignature: async (filename, userId) => {
        const userData = await UserRepository.updateUser({ signature: filename }, userId);
        return userData;
    },
    findUserById: async (userId) => {
        const foundedUser = await UserRepository.findUserById(userId)
        return foundedUser
    }
};