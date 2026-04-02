import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { UserRepository } from "./user.repository";
import { IUserServiceContract, AuthToken, CreateUser, VerifyPayload } from "./user.types";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const UserService: IUserServiceContract = {
    registration: async (data: CreateUser) => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await UserRepository.upsertOtp(data.email, code);

        await transporter.sendMail({
            from: 'mobileteamsocial@gmail.com',
            to: data.email,
            subject: "Код підтвердження",
            html: `<h1>Ваш код: ${code}</h1>`
        });

        console.log(`Sent to: ${data.email}`);

        return { message: "Verification code sent to email" };
    },

    verifyCode: async (payload: VerifyPayload): Promise<AuthToken> => {
        const { email, code, userData } = payload;
        const otpRecord = await UserRepository.getOtpByEmail(email);

        if (!otpRecord || otpRecord.code !== code) {
            throw new Error("Invalid or expired verification code");
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const createdUser = await UserRepository.createUser({
            ...userData,
            password: hashedPassword
        });

        const updatedUser = await UserRepository.updateNickname(
            createdUser.id, 
            `User${createdUser.id}`
        );

        await UserRepository.deleteOtp(email);

        const token = jwt.sign({ id: updatedUser.id }, JWT_SECRET, {
            expiresIn: '7d'
        });

        return { 
            token,
            user: {
                id: updatedUser.id,
                nickname: updatedUser.nickname,
                email: updatedUser.email
            }
        };
    }
};